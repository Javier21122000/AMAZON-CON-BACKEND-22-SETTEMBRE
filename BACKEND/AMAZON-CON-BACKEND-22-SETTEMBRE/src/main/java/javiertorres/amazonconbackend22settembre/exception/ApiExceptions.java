package javiertorres.amazonconbackend22settembre.exception;
public final class ApiExceptions { private ApiExceptions(){} public static class NotFound extends RuntimeException{public NotFound(String m){super(m);}} public static class Duplicate extends RuntimeException{public Duplicate(String m){super(m);}} }
