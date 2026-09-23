package javiertorres.amazonconbackend22settembre.entity;
import jakarta.persistence.*; import java.util.*;
@Entity @Table(name="utenti", uniqueConstraints={@UniqueConstraint(name="uk_utente_email", columnNames="email"),@UniqueConstraint(name="uk_utente_username", columnNames="username")})
public class Utente {
 @Id @GeneratedValue(strategy=GenerationType.UUID) private UUID id;
 @Column(nullable=false,length=80) private String username; @Column(nullable=false,length=160) private String email; @Column(nullable=false) private String password;
 @Column(nullable=false,length=80) private String firstName; @Column(nullable=false,length=80) private String lastName; @Column(nullable=false) private boolean enabled=true;
 @ManyToMany(fetch=FetchType.EAGER) @JoinTable(name="utente_ruoli",joinColumns=@JoinColumn(name="utente_id"),inverseJoinColumns=@JoinColumn(name="role_id")) private Set<Role> roles=new HashSet<>();
 protected Utente(){} public Utente(String username,String email,String password,String firstName,String lastName){this.username=username;this.email=email;this.password=password;this.firstName=firstName;this.lastName=lastName;}
 public UUID getId(){return id;} public String getUsername(){return username;} public String getEmail(){return email;} public String getPassword(){return password;} public String getFirstName(){return firstName;} public String getLastName(){return lastName;} public boolean isEnabled(){return enabled;} public Set<Role> getRoles(){return roles;}
}
