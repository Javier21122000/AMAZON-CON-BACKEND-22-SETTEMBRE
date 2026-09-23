package javiertorres.amazonconbackend22settembre.dto;
import jakarta.validation.constraints.*;
public final class AuthDtos {
 private AuthDtos(){}
 public record RegisterRequest(@NotBlank @Size(max=80) String username,@Email @NotBlank String email,@NotBlank @Size(min=8,max=100) String password,@NotBlank @Size(max=80) String firstName,@NotBlank @Size(max=80) String lastName){}
 public record LoginRequest(@Email @NotBlank String email,@NotBlank String password){}
 public record AuthResponse(String token, UserResponse user){}
 public record UserResponse(java.util.UUID id,String email,String firstName,String lastName,java.util.Set<String> roles){}
}
