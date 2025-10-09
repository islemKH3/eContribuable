package com.example.gestion_contribuable.DTO;

import lombok.Getter;
import lombok.Setter;

import java.time.LocalDateTime;

@Getter
@Setter
public class InputDTO {
    private Long id;
    private LocalDateTime date;
    private String msg_input;
    private OutputDTO output;
}
