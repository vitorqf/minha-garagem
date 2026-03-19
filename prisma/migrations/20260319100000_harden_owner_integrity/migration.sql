-- Ensure vehicles belong to an existing owner account
ALTER TABLE "Vehicle"
ADD CONSTRAINT "Vehicle_ownerId_fkey"
FOREIGN KEY ("ownerId") REFERENCES "User"("id")
ON DELETE RESTRICT
ON UPDATE CASCADE;

-- Support composite owner-scoped expense-to-vehicle integrity
CREATE UNIQUE INDEX "Vehicle_id_ownerId_key" ON "Vehicle"("id", "ownerId");

-- Replace single-column FK with owner-scoped composite FK
ALTER TABLE "Expense"
DROP CONSTRAINT "Expense_vehicleId_fkey";

ALTER TABLE "Expense"
ADD CONSTRAINT "Expense_vehicleId_ownerId_fkey"
FOREIGN KEY ("vehicleId", "ownerId") REFERENCES "Vehicle"("id", "ownerId")
ON DELETE RESTRICT
ON UPDATE CASCADE;
