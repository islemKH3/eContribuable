package com.example.gestion_contribuable.DTO;

import lombok.Getter;
import lombok.Setter;

import java.util.HashMap;
import java.util.List;
import java.util.Map;

@Getter
@Setter
public class FileDetailsDTO {
    private Long id;
    private String fileName;
    private String fileType;
    private byte[] fileData;
    private String ocrText;
    private Map<String,String> valeurs = new HashMap<>();

    public FileDetailsDTO(Long id, String fileName, String fileType, byte[] fileData, String ocrText, Map<String,String> valeurs) {
        this.id = id;
        this.fileName = fileName;
        this.fileType = fileType;
        this.fileData = fileData;
        this.ocrText = ocrText;
        this.valeurs = valeurs != null ? valeurs : new HashMap<>();
    }
}
