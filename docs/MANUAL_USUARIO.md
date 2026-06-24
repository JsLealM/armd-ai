# Manual de usuario — ARMD-AI

Prototipo académico de **apoyo exploratorio** para estimar la susceptibilidad antibiótica
(Susceptible / Resistant) de una combinación organismo–antibiótico, con explicabilidad **SHAP**.

> ⚠️ **Aviso clínico.** Es un prototipo académico. **No** reemplaza el antibiograma, el criterio médico ni los
> protocolos institucionales, y **no** es un dispositivo médico. Úsese solo como apoyo exploratorio.

---

## 1. Cómo levantar la aplicación

La forma recomendada es con **Docker** (no necesitas instalar Python, Node ni PostgreSQL):

```bash
docker compose up --build
```

Cuando termine, abre en el navegador:

| Servicio | URL |
|---|---|
| **Aplicación (frontend)** | http://localhost:5173 |
| API (backend) | http://localhost:8000 |
| Adminer (ver la base de datos) | http://localhost:8080 |

Para apagar: `Ctrl + C` y luego `docker compose down`.

---

## 2. Pantallas

- **Inicio**: presentación del prototipo y del flujo de trabajo.
- **Nueva evaluación**: formulario para ingresar el caso.
- **Resultado**: probabilidades, clase predicha, nivel de confianza y factores SHAP.
- **Modelos**: desempeño de los dos modelos disponibles.
- **Historial**: predicciones guardadas (consultadas desde la base de datos).
- **Asistente**: *Próximamente* (módulo RAG, trabajo futuro).

---

## 3. Hacer una predicción (paso a paso)

1. Entra a **Nueva evaluación**.
2. Elige el **Modelo de predicción**:
   - **XGBoost** (sobreajuste moderado) — por defecto.
   - **Regresión logística** (sobreajuste bajo) — alternativa lineal interpretable.
3. Completa la **información obligatoria**: microorganismo, antibiótico, tipo de cultivo, grupo etario y sexo.
4. (Opcional) Añade contexto clínico: modo de orden, salas hospitalarias, índice ADI, exposición antibiótica
   previa (18 clases), comorbilidades (8) y valores de laboratorio. Lo que no sepas, déjalo vacío.
5. Pulsa **Calcular susceptibilidad**.
6. En **Resultado** revisa:
   - **Probabilidades** de Resistant y Susceptible y la **clase predicha**.
   - **Nivel de confianza** (Alta / Media / Baja).
   - **Factores que influyeron** (SHAP): qué variables empujaron la predicción hacia resistencia o
     susceptibilidad. *No implican causalidad clínica.*
7. El caso queda guardado y aparece en **Historial**.

> Botones útiles: **Usar caso demo** rellena un ejemplo; **Limpiar** vacía el formulario.

---

## 4. Interpretación responsable

- La **probabilidad no es certeza** clínica.
- Los **factores SHAP** explican la predicción del modelo, no demuestran causa-efecto.
- Confirma siempre con **antibiograma** y los protocolos de tu institución.
- Cambiar de modelo puede cambiar las probabilidades y el método de explicación
  (TreeExplainer para XGBoost, LinearExplainer para la Regresión Logística).

---

## 5. Problemas frecuentes

- **El Historial o la predicción fallan**: revisa que PostgreSQL esté arriba (`docker compose ps` debe mostrar
  `armd_ai_postgres`). El backend funciona sin base para predecir, pero el guardado/historial sí la requiere.
- **`model_version` termina en `-demo`**: el backend no encontró el artefacto `.joblib` del modelo; genera los
  modelos con el notebook `modelo/V2/04_MODELADO/04E_exportar_modelo_api.ipynb` y reinicia el backend.
