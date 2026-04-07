# E2E vs. Unit Testing Philosophy (Iris Backend)

This skill defines the testing strategy for the Iris Backend, establishing a clear boundary between End-to-End (E2E) validation and Unit Testing responsibilities.

## 1. E2E Tests (Full Integration)

E2E tests validate the complete orchestration of all application layers: **Controller -> Use Case -> Repository (Real Database)**. The primary focus is **Security, Persistence, and Infrastructure Integrity**.

### When to use E2E?
Any logic that **depends on the database state** or **cross-layer infrastructure** MUST have a corresponding E2E test case.

* **Security & Access Control:** Validating Authentication guards (Auth) and Role-Based Access Control (RBAC).
* **Existence Validations:** Checking if resources exist (e.g., `EntityNotFoundError`).
* **Uniqueness Constraints:** Ensuring unique fields do not collide (e.g., `EmailAlreadyExists`).
* **Relational Integrity:** Validating links between entities (Foreign Keys).
* **Query Infrastructure:** Testing if filters, pagination, and sorting are correctly translated from the URL to the Database results.
* **Success Path:** Confirming the entire flow persists data correctly across all layers.

### What NOT to test in E2E?
Do not test format rules or character limits in E2E suites. If a validation can be performed without touching the database (e.g., Email Regex, String length), it belongs exclusively to Unit Tests.

---

## 2. Unit Tests (Isolation)

Unit tests focus on the **Domain** and **Application** layers in isolation, ensuring individual logic blocks function with high performance.

### What should be tested?
* **Input Validations:** Formats (Email, TaxId, UUID), string limits, and range checks.
* **Pure Domain Logic:** Calculations, internal state transitions, and data transformations.
* **Use Case Orchestration (Mocks):** Testing all logical branches (`if/else`) of a use case by mocking repository returns.

---

## 3. E2E Authentication & User Roles (Strict Rules)

- **The Master Local Tests Key:** Authentication via `Bearer ${env.MASTER_LOCAL_TESTS_KEY}` MUST ONLY be used when **creating a company** or **creating the very first user (onboarding)**. This is a temporary measure because full onboarding endpoints are not built yet and the platform needs to be fully working before designing them. NEVER use this key for any other standard requests.
- **Mandatory Authentication Tests:** EVERY, REPEAT: EVERY E2E test file MUST contain at least one test validating the user authentication (e.g., verifying without a token returns a `401 Unauthorized`).
- **Master vs Normal Routes Restrictions:**
  - If the endpoint has `@AuthOptions({ onlyMastersCanAccess: true })`: You MUST test the route using a **master user** (`masterToken`), AND include at least one validation proving that a **normal user** (`normalToken`) cannot access it.
  - If the endpoint does NOT have `onlyMastersCanAccess` set: You MUST test its functionalities using **ONLY a normal user** (`normalToken`). Do NOT use a master user to test standard endpoints.

---

> [!IMPORTANT]
> **The Golden Rule:** If an error logic requires a call to `repository.find...`, any DB-dependent method, or involves Authentication/RBAC guards, it strictly requires an E2E test case.