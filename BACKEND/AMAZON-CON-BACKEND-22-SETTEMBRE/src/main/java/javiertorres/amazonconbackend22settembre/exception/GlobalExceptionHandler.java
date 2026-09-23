package javiertorres.amazonconbackend22settembre.exception;
import java.util.*; import org.springframework.http.*; import org.springframework.security.authentication.BadCredentialsException; import org.springframework.validation.FieldError; import org.springframework.web.bind.MethodArgumentNotValidException; import org.springframework.web.bind.annotation.*;
@RestControllerAdvice
public class GlobalExceptionHandler {
 record ErrorResponse(String error,Map<String,String> details){}
 @ExceptionHandler(ApiExceptions.NotFound.class) ResponseEntity<ErrorResponse> notFound(ApiExceptions.NotFound e){return ResponseEntity.status(HttpStatus.NOT_FOUND).body(new ErrorResponse(e.getMessage(),Map.of()));}
 @ExceptionHandler(ApiExceptions.Duplicate.class) ResponseEntity<ErrorResponse> duplicate(ApiExceptions.Duplicate e){return ResponseEntity.status(HttpStatus.CONFLICT).body(new ErrorResponse(e.getMessage(),Map.of()));}
 @ExceptionHandler(MethodArgumentNotValidException.class) ResponseEntity<ErrorResponse> validation(MethodArgumentNotValidException e){Map<String,String> m=new LinkedHashMap<>(); for(FieldError f:e.getBindingResult().getFieldErrors())m.put(f.getField(),f.getDefaultMessage()); return ResponseEntity.badRequest().body(new ErrorResponse("Validation failed",m));}
 @ExceptionHandler({BadCredentialsException.class,org.springframework.security.access.AccessDeniedException.class}) ResponseEntity<ErrorResponse> auth(Exception e){return ResponseEntity.status(e instanceof BadCredentialsException?401:403).body(new ErrorResponse("Authentication or authorization failed",Map.of()));}
}
