package javiertorres.amazonconbackend22settembre.security;
import jakarta.servlet.*; import jakarta.servlet.http.*; import java.io.IOException; import org.springframework.security.authentication.UsernamePasswordAuthenticationToken; import org.springframework.security.core.context.SecurityContextHolder; import org.springframework.security.core.userdetails.UserDetails; import org.springframework.security.core.userdetails.UserDetailsService; import org.springframework.stereotype.Component; import org.springframework.web.filter.OncePerRequestFilter;
@Component public class JwtAuthFilter extends OncePerRequestFilter {
 private final JwtService jwt; private final UserDetailsService users;
 public JwtAuthFilter(JwtService jwt,UserDetailsService users){this.jwt=jwt;this.users=users;}
 protected void doFilterInternal(HttpServletRequest req,HttpServletResponse res,FilterChain chain)throws ServletException,IOException{String h=req.getHeader("Authorization"); if(h!=null&&h.startsWith("Bearer ")){try{String email=jwt.subject(h.substring(7));UserDetails u=users.loadUserByUsername(email);SecurityContextHolder.getContext().setAuthentication(new UsernamePasswordAuthenticationToken(u,null,u.getAuthorities()));}catch(RuntimeException ignored){}} chain.doFilter(req,res);}
}
