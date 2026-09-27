import { createServer } from "http";
import next from "next";

const app = next({ dev: false, dir: process.cwd() });
const handle = app.getRequestHandler();

async function runTests() {
  await app.prepare();
  const port = 3055;
  const server = createServer((req, res) => handle(req, res));

  await new Promise((resolve) => server.listen(port, resolve));
  console.log(`Test Next.js server running on http://localhost:${port}`);

  const baseUrl = `http://localhost:${port}`;
  let passed = 0;
  let failed = 0;

  function assert(condition, testName, details) {
    if (condition) {
      console.log(` PASS: ${testName}`);
      passed++;
    } else {
      console.error(` FAIL: ${testName}`, details || "");
      failed++;
    }
  }

  try {
    // 1. GET /api/experiments
    console.log("\n--- Testing GET /api/experiments ---");
    const expRes = await fetch(`${baseUrl}/api/experiments`);
    const expJson = await expRes.json();
    assert(expRes.status === 200, "GET /api/experiments status is 200");
    assert(expJson.success === true, "GET /api/experiments success flag is true");
    assert(Array.isArray(expJson.data) && expJson.data.length > 0, "Returns experiment list");
    assert(expJson.data[0].id === "acid-base-testing", "Flagship experiment is 'acid-base-testing'");

    // 2. GET /api/experiments/acid-base-testing
    console.log("\n--- Testing GET /api/experiments/[id] ---");
    const idRes = await fetch(`${baseUrl}/api/experiments/acid-base-testing`);
    const idJson = await idRes.json();
    assert(idRes.status === 200, "GET /api/experiments/acid-base-testing status is 200");
    assert(idJson.data.substances.length >= 10, "Contains comprehensive substance catalog");
    assert(idJson.data.indicators.length >= 3, "Contains natural & laboratory indicators");
    assert(idJson.data.steps.localLab.length > 0, "Contains LOCAL LAB steps");
    assert(idJson.data.steps.virtualLab.length > 0, "Contains VIRTUAL LAB steps");

    // 2b. GET /api/experiments/unknown (404 test)
    const notFoundRes = await fetch(`${baseUrl}/api/experiments/non-existent-experiment`);
    const notFoundJson = await notFoundRes.json();
    assert(notFoundRes.status === 404, "Unknown experiment returns 404");
    assert(notFoundJson.success === false, "Error response format has success: false");
    assert(notFoundJson.error.code === "NOT_FOUND", "Error code is NOT_FOUND");

    // 3. POST /api/experiment/start
    console.log("\n--- Testing POST /api/experiment/start ---");
    const startRes = await fetch(`${baseUrl}/api/experiment/start`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        experimentId: "acid-base-testing",
        mode: "VIRTUAL_LAB",
        studentName: "Ada Lovelace",
        containerCount: 3,
      }),
    });
    const startJson = await startRes.json();
    assert(startRes.status === 201, "Start experiment returns 201 Created");
    assert(startJson.success === true, "Start experiment success is true");
    const sessionId = startJson.data.sessionId;
    assert(Boolean(sessionId), "Session ID generated successfully");
    assert(Object.keys(startJson.data.containers).length === 3, "Created 3 initial containers");

    // 4. POST /api/experiment/action (Simulating virtual titration & neutralization)
    console.log("\n--- Testing POST /api/experiment/action ---");

    // Action A: Add vinegar to container_1
    const addAcidRes = await fetch(`${baseUrl}/api/experiment/action`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        sessionId,
        actionType: "ADD_SUBSTANCE",
        containerId: "container_1",
        substanceId: "vinegar",
        volumeMl: 20,
      }),
    });
    const addAcidJson = await addAcidRes.json();
    assert(addAcidRes.status === 200, "Add substance returns 200");
    assert(addAcidJson.data.outcome.newPh < 3.0, "Acidic pH correctly calculated (< 3.0)");

    // Action B: Add red cabbage indicator to container_1
    const addIndRes = await fetch(`${baseUrl}/api/experiment/action`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        sessionId,
        actionType: "ADD_INDICATOR",
        containerId: "container_1",
        indicatorId: "red_cabbage_extract",
      }),
    });
    const addIndJson = await addIndRes.json();
    assert(addIndRes.status === 200, "Add indicator returns 200");
    assert(
      addIndJson.data.outcome.newColor.includes("Red") || addIndJson.data.outcome.newColor.includes("Pink"),
      `Acid turned cabbage indicator reddish/pink (${addIndJson.data.outcome.newColor})`
    );

    // Action C: Add baking soda to trigger neutralization and bubbling
    const neutralRes = await fetch(`${baseUrl}/api/experiment/action`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        sessionId,
        actionType: "ADD_SUBSTANCE",
        containerId: "container_1",
        substanceId: "baking_soda_solution",
        volumeMl: 50,
      }),
    });
    const neutralJson = await neutralRes.json();
    assert(neutralRes.status === 200, "Neutralization action returns 200");
    assert(neutralJson.data.outcome.effervescence === true, "Effervescence (CO2 fizzing) detected");
    assert(neutralJson.data.outcome.neutralizationOccurred === true, "Neutralization confirmed");
    assert(neutralJson.data.outcome.newPh > addAcidJson.data.outcome.newPh, "pH increased towards neutral");

    // Action D: Record observation
    const obsRes = await fetch(`${baseUrl}/api/experiment/action`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        sessionId,
        actionType: "RECORD_OBSERVATION",
        observation: {
          substanceTested: "vinegar",
          indicatorUsed: "red_cabbage_extract",
          observedColor: "Vivid Pink",
          inferredPh: 2.5,
          inferredCategory: "acid",
          notes: "Bubbled when baking soda was introduced.",
        },
      }),
    });
    const obsJson = await obsRes.json();
    assert(obsRes.status === 200, "Record observation returns 200");
    assert(obsJson.data.session.observations.length === 1, "Observation recorded in session");

    // 5. POST /api/safety/check
    console.log("\n--- Testing POST /api/safety/check ---");
    // Safe check
    const safeCheckRes = await fetch(`${baseUrl}/api/safety/check`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        substances: ["lemon_juice", "distilled_water"],
        mode: "LOCAL_LAB",
      }),
    });
    const safeCheckJson = await safeCheckRes.json();
    assert(safeCheckRes.status === 200, "Safety check returns 200");
    assert(safeCheckJson.data.isSafe === true, "Safe substances pass check");

    // Hazardous check (Bleach + Acid -> Toxic Chlorine Gas)
    const hazardCheckRes = await fetch(`${baseUrl}/api/safety/check`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        substances: ["household_bleach", "vinegar"],
        mode: "LOCAL_LAB",
      }),
    });
    const hazardCheckJson = await hazardCheckRes.json();
    assert(hazardCheckJson.data.isSafe === false, "Dangerous combination flagged unsafe");
    assert(hazardCheckJson.data.hazardLevel === "PROHIBITED", "Hazard level is PROHIBITED");
    assert(hazardCheckJson.data.blocked === true, "Dangerous action is blocked");

    // 5b. Safety violation via action endpoint (should return 403 SAFETY_VIOLATION)
    const dangerousActionRes = await fetch(`${baseUrl}/api/experiment/action`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        sessionId,
        actionType: "ADD_SUBSTANCE",
        containerId: "container_2",
        substanceId: "household_bleach",
      }),
    });
    // Add vinegar to bleach in container_2
    const bleachVinegarRes = await fetch(`${baseUrl}/api/experiment/action`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        sessionId,
        actionType: "ADD_SUBSTANCE",
        containerId: "container_2",
        substanceId: "vinegar",
      }),
    });
    const bleachVinegarJson = await bleachVinegarRes.json();
    assert(bleachVinegarRes.status === 403, "Bleach + Vinegar action returns 403 Forbidden");
    assert(bleachVinegarJson.error.code === "SAFETY_VIOLATION", "Error code is SAFETY_VIOLATION");

    // 6. POST /api/ai/explain
    console.log("\n--- Testing POST /api/ai/explain ---");
    const explainRes = await fetch(`${baseUrl}/api/ai/explain`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        experimentId: "acid-base-testing",
        mode: "LOCAL_LAB",
        topic: "COLOR_CHANGE",
        substanceA: "vinegar",
        indicatorUsed: "red_cabbage_extract",
        observedColor: "Pink",
      }),
    });
    const explainJson = await explainRes.json();
    assert(explainRes.status === 200, "AI explain returns 200");
    assert(explainJson.success === true, "AI explain success is true");
    assert(Boolean(explainJson.data.explanation), "Provides structured pedagogical explanation");
    assert(Array.isArray(explainJson.data.keyConcepts), "Returns key concepts array");

    // 7. POST /api/ai/feedback
    console.log("\n--- Testing POST /api/ai/feedback ---");
    const feedbackRes = await fetch(`${baseUrl}/api/ai/feedback`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        experimentId: "acid-base-testing",
        mode: "LOCAL_LAB",
        feedbackType: "HYPOTHESIS",
        studentInput: "If I add red cabbage juice to lemon juice, it will turn bright pink because lemon juice is an acid.",
        substanceTested: "lemon_juice",
      }),
    });
    const feedbackJson = await feedbackRes.json();
    assert(feedbackRes.status === 200, "AI feedback returns 200");
    assert(feedbackJson.success === true, "AI feedback success is true");
    assert(Boolean(feedbackJson.data.praise), "Provides encouraging praise");
    assert(Boolean(feedbackJson.data.constructiveGuidance), "Provides constructive guidance");

    // 8. GET & POST /api/assessment
    console.log("\n--- Testing /api/assessment ---");
    const assessQRes = await fetch(`${baseUrl}/api/assessment`);
    const assessQJson = await assessQRes.json();
    assert(assessQRes.status === 200, "GET /api/assessment returns 200");
    assert(assessQJson.data.questions.length >= 4, "Returns assessment questions");

    const submitAssessRes = await fetch(`${baseUrl}/api/assessment`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        sessionId,
        experimentId: "acid-base-testing",
        mode: "VIRTUAL_LAB",
        answers: [
          { questionId: "q1_acidity_ion", studentAnswer: "Hydrogen ion (H+)" },
          { questionId: "q2_indicator_color", studentAnswer: "It turns teal and green" },
          { questionId: "q3_neutralization_products", studentAnswer: "Water and salt" },
          { questionId: "q4_bleach_safety", studentAnswer: "It produces toxic chlorine gas" },
        ],
        observations: [
          { substanceId: "vinegar", observedColor: "Pink", classifiedAs: "acid" },
          { substanceId: "baking_soda_solution", observedColor: "Teal", classifiedAs: "base" },
          { substanceId: "distilled_water", observedColor: "Purple", classifiedAs: "neutral" },
        ],
        reflection: "I learned how everyday materials like vinegar and baking soda exhibit real chemical neutralization and how natural indicators detect pH.",
      }),
    });
    const submitAssessJson = await submitAssessRes.json();
    assert(submitAssessRes.status === 200, "Assessment evaluation returns 200");
    assert(submitAssessJson.data.score > 80, `Scored high on accurate answers (${submitAssessJson.data.score}/${submitAssessJson.data.maxScore})`);
    assert(submitAssessJson.data.grade === "Distinction", `Achieved Distinction grade (${submitAssessJson.data.grade})`);

    // 9. Validation error test (Zod 400 test)
    console.log("\n--- Testing Zod validation error formatting ---");
    const invalidRes = await fetch(`${baseUrl}/api/experiment/action`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        sessionId: "not-a-valid-uuid",
        actionType: "INVALID_ACTION_NAME",
      }),
    });
    const invalidJson = await invalidRes.json();
    assert(invalidRes.status === 400, "Invalid payload returns 400 Bad Request");
    assert(invalidJson.success === false, "Error response success flag is false");
    assert(invalidJson.error.code === "VALIDATION_ERROR", "Error code is VALIDATION_ERROR");

    console.log(`\n========================================`);
    console.log(`RESULTS: ${passed} PASSED, ${failed} FAILED`);
    console.log(`========================================\n`);

    server.close();
    process.exit(failed > 0 ? 1 : 0);
  } catch (err) {
    console.error("Test execution error:", err);
    server.close();
    process.exit(1);
  }
}

runTests();
