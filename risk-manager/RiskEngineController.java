package com.ai.riskmanager.controller;

import org.springframework.web.bind.annotation.*;
import java.util.*;

/**
 * Enterprise Risk Calculation API Controller
 * Provides validation algorithms and persistent register tracking backend mapping services.
 */
@RestController
@RequestMapping("/api/analytics/risk")
@CrossOrigin(origins = "*")
public class RiskEngineController {

    public static class RiskProfile {
        public String id;
        public String name;
        public int probability;
        public int impact;
        public String category;
        public int compositeScore;
        public String classification;
    }

    private final List<RiskProfile> databaseRegister = new ArrayList<>();

    @PostMapping("/calculate")
    public RiskProfile processRiskMetrics(@RequestBody RiskProfile payload) {
        // Compute quantitative compound factor matrix variables
        payload.id = "RSK-" + UUID.randomUUID().toString().substring(0, 4).toUpperCase();
        payload.compositeScore = payload.probability * payload.impact;
        
        if (payload.compositeScore >= 15) {
            payload.classification = "Critical";
        } else if (payload.compositeScore >= 8) {
            payload.classification = "Medium";
        } else {
            payload.classification = "Low";
        }
        
        databaseRegister.add(payload);
        return payload;
    }

    @GetMapping("/logs")
    public List<RiskProfile> getHistoricalRegistries() {
        return databaseRegister;
    }
}
