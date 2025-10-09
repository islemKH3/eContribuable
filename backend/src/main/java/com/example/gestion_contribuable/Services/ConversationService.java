package com.example.gestion_contribuable.Services;
import com.example.gestion_contribuable.DTO.ConversationDTO;
import com.example.gestion_contribuable.DTO.InputDTO;
import com.example.gestion_contribuable.DTO.OutputDTO;
import com.example.gestion_contribuable.Entities.*;
import com.example.gestion_contribuable.Repositories.*;
import org.springframework.http.*;
import org.springframework.stereotype.Service;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.client.RestTemplate;

import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

@Service
public class ConversationService {

    private final ConversationRepository chatbotRepo;
    private final InputRepository inputRepo;
    private final OutputRepository outputRepo;
    private final ClientFiscalRepository clientFiscalRepo;
    private final RestTemplate restTemplate = new RestTemplate();
    private final String FLASK_URL = "http://localhost:5000/ask";

    @Autowired
    public ConversationService(ClientFiscalRepository clientFiscalRepo, ConversationRepository chatbotRepo, InputRepository inputRepo, OutputRepository outputRepo) {
        this.clientFiscalRepo = clientFiscalRepo;
        this.chatbotRepo = chatbotRepo;
        this.inputRepo = inputRepo;
        this.outputRepo = outputRepo;
    }

    public List<InputDTO> getUserChatHistory(Long userId) {
        ClientFiscal user= clientFiscalRepo.getByIdUtilisateur(userId);
        Conversation conversation = chatbotRepo.findByClientFiscal(user);
        List <InputDTO> inputs = new ArrayList<>();
        for (Input input : inputRepo.findByConversationOrderByDateInputAsc(conversation)) {

            OutputDTO outdto = null;
            if (input.getReponseAi() != null) {
                outdto = new OutputDTO();
                outdto.setId(input.getReponseAi().getIdOutput());
                outdto.setMsg_output(input.getReponseAi().getMsgOutput());
            }

            InputDTO indto = new InputDTO();
            indto.setId(input.getIdInput());
            indto.setDate(input.getDateInput());
            indto.setMsg_input(input.getMsgInput());
            indto.setOutput(outdto);

            inputs.add(indto);
        }
        return inputs;

    }

    public List<ConversationDTO> getAllThreads() {
        List<Conversation> chats= chatbotRepo.findAll();
        List<ConversationDTO> dtos = new ArrayList<>();
        for (Conversation conversation : chats) {
            ConversationDTO dto = new ConversationDTO();
            dto.setId(conversation.getIdChat());
            dto.setUtilisateur(conversation.getClientFiscal().getIdUtilisateur());
            Contribuable contribuable=conversation.getClientFiscal().getContribuable();
            if (contribuable.getType().equals("PersonnePhysique"))
            {
                PersonnePhysique personnePhysique = (PersonnePhysique) contribuable;
                dto.setNom(personnePhysique.getNom());
                dto.setPrenom(personnePhysique.getPrenom());
            }
            else {
                PersonneMorale personneMorale = (PersonneMorale) contribuable;
                dto.setNom(personneMorale.getRaisonSociale());
            }
            dto.setDate(conversation.getDateChat());
            for (Input input : inputRepo.findByConversationOrderByDateInputAsc(conversation)) {

                InputDTO indto = new InputDTO();
                indto.setId(input.getIdInput());
                indto.setDate(input.getDateInput());
                indto.setMsg_input(input.getMsgInput());

                if (input.getReponseAi() != null){
                    OutputDTO outdto = new OutputDTO();
                    outdto.setId(input.getReponseAi().getIdOutput());
                    outdto.setMsg_output(input.getReponseAi().getMsgOutput());
                    indto.setOutput(outdto);
                } else {
                    indto.setOutput(null);
                }

                dto.getInput().add(indto);
            }
            dtos.add(dto);
        }
        return dtos;
    }

    public String handleUserQuestion(Long userId, String msg) {
        ClientFiscal user = clientFiscalRepo.getByIdUtilisateur(userId);
        Conversation conversation = user.getConversation();

        if (conversation == null) {
            conversation = new Conversation();
            conversation.setDateChat(LocalDateTime.now());

            conversation.setClientFiscal(user);
            user.setConversation(conversation);

            chatbotRepo.save(conversation);
            clientFiscalRepo.save(user);
        }

        Input input = new Input();
        input.setConversation(conversation);
        input.setMsgInput(msg);
        input.setDateInput(LocalDateTime.now());
        input = inputRepo.save(input);

        String output_msg = askQuestion(msg);

        Output output = new Output();
        output.setQuestion(input);
        output.setMsgOutput(output_msg);
        outputRepo.save(output);

        input.setReponseAi(output);
        input = inputRepo.save(input);

        return output.getMsgOutput();
    }

    public String askQuestion(String question) {
        HttpHeaders headers =new HttpHeaders();
        headers.setContentType(MediaType.APPLICATION_JSON);

        Map<String, String> payload = new HashMap<>();
        payload.put("question", question);

        HttpEntity<Map<String, String>> request = new HttpEntity<>(payload, headers);

        ResponseEntity<Map> response = restTemplate.postForEntity(FLASK_URL, request, Map.class);

        if (response.getStatusCode() == HttpStatus.OK && response.getBody() != null) {
            return (String) response.getBody().get("answer");
        } else {
            return "Désolé, nous ne pouvons pas vous générer une réponse!";
        }
    }
}
