-- ============================================================================
-- ARMD-AI :: Esquema de base de datos (PostgreSQL)
-- Historial de predicciones de susceptibilidad antibiotica (XGBoost + SHAP)
-- Contrato de variables alineado al dataset final V2 (61 features de modelado).
-- Motor: PostgreSQL 14+  (probado en postgres:16)
-- ============================================================================

DROP TABLE IF EXISTS shap_valor CASCADE;
DROP TABLE IF EXISTS prediccion_comorbilidad CASCADE;
DROP TABLE IF EXISTS prediccion_exposicion_antibiotica CASCADE;
DROP TABLE IF EXISTS prediccion CASCADE;
DROP TABLE IF EXISTS comorbilidad_catalogo CASCADE;
DROP TABLE IF EXISTS exposicion_antibiotica_catalogo CASCADE;

CREATE TABLE prediccion (
    prediccion_id SERIAL PRIMARY KEY,
    session_id VARCHAR(100),
    paciente_referencia VARCHAR(100),

    organismo VARCHAR(150) NOT NULL,
    antibiotico VARCHAR(150) NOT NULL,
    tipo_cultivo VARCHAR(150) NOT NULL,
    ordering_mode VARCHAR(50),
    edad VARCHAR(30),
    sexo VARCHAR(30),

    hosp_ward_icu INTEGER DEFAULT 0 CHECK (hosp_ward_icu IN (0, 1)),
    hosp_ward_er INTEGER DEFAULT 0 CHECK (hosp_ward_er IN (0, 1)),
    hosp_ward_ip INTEGER DEFAULT 0 CHECK (hosp_ward_ip IN (0, 1)),
    hosp_ward_op INTEGER DEFAULT 0 CHECK (hosp_ward_op IN (0, 1)),

    adi_score DECIMAL,
    adi_state_rank DECIMAL,
    median_wbc DECIMAL,
    median_neutrophils DECIMAL,
    median_lymphocytes DECIMAL,
    median_cr DECIMAL,
    median_bun DECIMAL,
    median_lactate DECIMAL,
    median_procalcitonin DECIMAL,
    median_temp DECIMAL,
    median_heartrate DECIMAL,
    median_resprate DECIMAL,
    median_sysbp DECIMAL,
    median_diasbp DECIMAL,

    modelo_nombre VARCHAR(100) NOT NULL DEFAULT 'XGBoost',
    modelo_version VARCHAR(100) NOT NULL DEFAULT 'v2-xgboost-shap',
    clase_predicha VARCHAR(30) NOT NULL CHECK (clase_predicha IN ('Susceptible', 'Resistant')),
    probabilidad_susceptible DECIMAL NOT NULL CHECK (probabilidad_susceptible >= 0 AND probabilidad_susceptible <= 1),
    probabilidad_resistant DECIMAL NOT NULL CHECK (probabilidad_resistant >= 0 AND probabilidad_resistant <= 1),
    nivel_confianza VARCHAR(30),
    metodo_explicacion VARCHAR(120) DEFAULT 'SHAP TreeExplainer',

    request_json TEXT,
    response_json TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE shap_valor (
    shap_valor_id SERIAL PRIMARY KEY,
    prediccion_id INTEGER NOT NULL,
    variable VARCHAR(200) NOT NULL,
    valor_variable TEXT,
    shap_value DECIMAL NOT NULL,
    direccion VARCHAR(30) CHECK (direccion IN ('towards_resistant', 'towards_susceptible', 'neutral')),
    ranking INTEGER,
    FOREIGN KEY (prediccion_id) REFERENCES prediccion(prediccion_id)
        ON UPDATE CASCADE
        ON DELETE CASCADE
);

CREATE TABLE comorbilidad_catalogo (
    comorbilidad_id SERIAL PRIMARY KEY,
    codigo VARCHAR(100) NOT NULL UNIQUE,
    nombre VARCHAR(150) NOT NULL
);

CREATE TABLE prediccion_comorbilidad (
    prediccion_id INTEGER NOT NULL,
    comorbilidad_id INTEGER NOT NULL,
    presente INTEGER NOT NULL DEFAULT 1 CHECK (presente IN (0, 1)),
    PRIMARY KEY (prediccion_id, comorbilidad_id),
    FOREIGN KEY (prediccion_id) REFERENCES prediccion(prediccion_id)
        ON UPDATE CASCADE
        ON DELETE CASCADE,
    FOREIGN KEY (comorbilidad_id) REFERENCES comorbilidad_catalogo(comorbilidad_id)
        ON UPDATE CASCADE
        ON DELETE CASCADE
);

CREATE TABLE exposicion_antibiotica_catalogo (
    exposicion_id SERIAL PRIMARY KEY,
    codigo VARCHAR(100) NOT NULL UNIQUE,
    nombre VARCHAR(150) NOT NULL
);

CREATE TABLE prediccion_exposicion_antibiotica (
    prediccion_id INTEGER NOT NULL,
    exposicion_id INTEGER NOT NULL,
    presente INTEGER NOT NULL DEFAULT 1 CHECK (presente IN (0, 1)),
    PRIMARY KEY (prediccion_id, exposicion_id),
    FOREIGN KEY (prediccion_id) REFERENCES prediccion(prediccion_id)
        ON UPDATE CASCADE
        ON DELETE CASCADE,
    FOREIGN KEY (exposicion_id) REFERENCES exposicion_antibiotica_catalogo(exposicion_id)
        ON UPDATE CASCADE
        ON DELETE CASCADE
);

-- Catalogo de comorbilidades agrupadas (7 grupos usados por el modelo V2)
INSERT INTO comorbilidad_catalogo (codigo, nombre) VALUES
('comorb_chronic_pulmonary_any', 'Enfermedad pulmonar cronica'),
('comorb_congestive_heart_failure', 'Insuficiencia cardiaca congestiva'),
('comorb_diabetes_any', 'Diabetes'),
('comorb_organ_transplant_status', 'Trasplante de organo'),
('comorb_pancreatic_disorder', 'Trastorno pancreatico'),
('comorb_renal_failure', 'Insuficiencia renal'),
('comorb_sinusitis', 'Sinusitis'),
('comorb_solid_tumor_non_metastatic', 'Tumor solido no metastasico')
ON CONFLICT (codigo) DO NOTHING;

-- Catalogo de exposicion antibiotica previa por clase (18 clases del modelo V2)
INSERT INTO exposicion_antibiotica_catalogo (codigo, nombre) VALUES
('exp_prev_aminoglycoside', 'Aminoglucosidos'),
('exp_prev_ansamycin', 'Ansamicinas'),
('exp_prev_antitubercular', 'Antituberculosos'),
('exp_prev_beta_lactam', 'Beta-lactamicos'),
('exp_prev_combination_antibiotic', 'Terapia combinada'),
('exp_prev_fluoroquinolone', 'Fluoroquinolonas'),
('exp_prev_folate_synthesis_inhibitor', 'Inhibidores de sintesis de folato'),
('exp_prev_fosfomycin', 'Fosfomicina'),
('exp_prev_glycopeptide', 'Glucopeptidos'),
('exp_prev_macrolide_lincosamide', 'Macrolidos/lincosamidas'),
('exp_prev_monobactam', 'Monobactamicos'),
('exp_prev_nitrofuran', 'Nitrofuranos'),
('exp_prev_nitroimidazole', 'Nitroimidazoles'),
('exp_prev_oxazolidinone', 'Oxazolidinonas'),
('exp_prev_polymyxin_lipopeptide', 'Polimixinas/lipopeptidos'),
('exp_prev_sulfonamide', 'Sulfonamidas'),
('exp_prev_tetracycline', 'Tetraciclinas'),
('exp_prev_urinary_antiseptic', 'Antisepticos urinarios')
ON CONFLICT (codigo) DO NOTHING;

CREATE INDEX IF NOT EXISTS idx_prediccion_session_id ON prediccion(session_id);
CREATE INDEX IF NOT EXISTS idx_prediccion_created_at ON prediccion(created_at);
CREATE INDEX IF NOT EXISTS idx_prediccion_organismo ON prediccion(organismo);
CREATE INDEX IF NOT EXISTS idx_prediccion_antibiotico ON prediccion(antibiotico);
CREATE INDEX IF NOT EXISTS idx_prediccion_clase_predicha ON prediccion(clase_predicha);
CREATE INDEX IF NOT EXISTS idx_shap_valor_prediccion_id ON shap_valor(prediccion_id);
CREATE INDEX IF NOT EXISTS idx_shap_valor_variable ON shap_valor(variable);
