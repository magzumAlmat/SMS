package kz.kazniisa.sms.logic.controller;

import kz.kazniisa.sms.logic.model.AGSKDocument;
import kz.kazniisa.sms.logic.service.AGSKDocumentService;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.servlet.support.ServletUriComponentsBuilder;

import java.net.URI;
import java.util.List;

//@CrossOrigin(origins = { "http://localhost:3000" })
@CrossOrigin(origins = "*", allowedHeaders = "*")
@RestController
public class AGSKDocumentController {

    private static Logger logger = LoggerFactory.getLogger(AGSKDocumentController.class);

    @Autowired
    private AGSKDocumentService agskDocumentService;

    @GetMapping("/agsk-documents")
    public List<AGSKDocument> getAllDocuments() { return agskDocumentService.getAll(); }

//    @GetMapping("/agsk-documents/filter/{documentTypeId}")
//    public List<AGSKDocument> getFilteredDocuments(@PathVariable long documentTypeId) {
//        return agskDocumentService.getFiltered(documentTypeId);
//    }

    @DeleteMapping("/agsk-documents/{id}")
    public ResponseEntity<Void> deleteDocument(@PathVariable long id) {

        AGSKDocument document = agskDocumentService.delete(id);

        if (document != null) {
            return ResponseEntity.noContent().build();
        }

        return ResponseEntity.notFound().build();
    }

    @GetMapping("/agsk-documents/{id}")
    public AGSKDocument getDocument(@PathVariable long id) {
        return agskDocumentService.findById(id);
    }

    /*@GetMapping("/agsk-documents/{id}/{code}")
    public AGSKDocument getDocumentByCode(@PathVariable long id, @PathVariable String code) {
        return agskDocumentService.findByCode(code);
    }*/

    @PutMapping("/agsk-documents/{id}")
    public ResponseEntity<AGSKDocument> updateDocument(@PathVariable long id,
                                                       @RequestBody AGSKDocument document) {

        AGSKDocument documentUpdated = agskDocumentService.save(document);

        return new ResponseEntity<AGSKDocument>(documentUpdated, HttpStatus.OK);
    }

    @PostMapping("/agsk-documents")
    public ResponseEntity<Void> createDocument(@RequestBody AGSKDocument document) {

        AGSKDocument createdDocument = agskDocumentService.save(document);

//         Location
//         Get current resource url
//        / {id}
        URI uri = ServletUriComponentsBuilder.fromCurrentRequest().path("/{id}").buildAndExpand(createdDocument.getId())
                .toUri();

        return ResponseEntity.created(uri).build();
    }

    @PostMapping("/agsk-documents/filter")
    public List<AGSKDocument> getMultiFilteredDocuments(@RequestBody AGSKDocument documentAttributes) {
        return agskDocumentService.getMultiFiltered(documentAttributes);
    }

}
