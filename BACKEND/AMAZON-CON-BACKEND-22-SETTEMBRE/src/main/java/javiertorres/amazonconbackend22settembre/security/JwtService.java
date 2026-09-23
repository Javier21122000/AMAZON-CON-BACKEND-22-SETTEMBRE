package javiertorres.amazonconbackend22settembre.security;
import io.jsonwebtoken.*; import io.jsonwebtoken.security.Keys; import java.nio.charset.StandardCharsets; import java.util.*; import javax.crypto.SecretKey; import org.springframework.beans.factory.annotation.Value; import org.springframework.stereotype.Service;
@Service public class JwtService {
 private final SecretKey key; private final long expiration;
 public JwtService(@Value("${app.jwt.secret}") String secret,@Value("${app.jwt.expiration-ms}") long expiration){key=Keys.hmacShaKeyFor(secret.getBytes(StandardCharsets.UTF_8));this.expiration=expiration;}
 public String generate(String email,Collection<String> roles){return Jwts.builder().subject(email).claim("roles",roles).issuedAt(new Date()).expiration(new Date(System.currentTimeMillis()+expiration)).signWith(key).compact();}
 public String subject(String token){return Jwts.parser().verifyWith(key).build().parseSignedClaims(token).getPayload().getSubject();}
}
