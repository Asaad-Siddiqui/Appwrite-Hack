// Seed LendLoop on your own Appwrite project. Server key only, from env.
// Usage (never commit the key):
//   APPWRITE_ENDPOINT=... APPWRITE_PROJECT_ID=... APPWRITE_API_KEY=... node scripts/seed.mjs
// Requires: npm install node-appwrite
import { Client, TablesDB, ID } from "node-appwrite";
const endpoint = process.env.APPWRITE_ENDPOINT;
const project = process.env.APPWRITE_PROJECT_ID;
const key = process.env.APPWRITE_API_KEY;
if (!endpoint || !project || !key) { console.error("Set APPWRITE_ENDPOINT, APPWRITE_PROJECT_ID, APPWRITE_API_KEY"); process.exit(1); }
const client = new Client().setEndpoint(endpoint).setProject(project).setKey(key);
const db = new TablesDB(client);
const DB = "lendloop";
const put = async (table, id, data) => {
  const r = await db.createRow(DB, table, id, data);
  console.log(table, r.$id);
};
for (const [id, data] of [
  ["priya", { name: "Priya Sharma", neighbourhood: "Andheri West", phone: "90000 00001" }],
  ["rahul", { name: "Rahul Verma", neighbourhood: "Bandra East", phone: "90000 00002" }],
  ["ananya", { name: "Ananya Iyer", neighbourhood: "Powai", phone: "90000 00003" }],
]) await put("members", id, data);
const items = [
  ["cordless-drill", { ownerMemberId: "priya", name: "Cordless Drill 18V", category: "Power Tools", condition: "Good", description: "18V cordless drill with two batteries and a bit set.", status: "borrowed" }],
  ["step-ladder", { ownerMemberId: "rahul", name: "Step Ladder 6ft", category: "Garden & Home", condition: "Excellent", description: "Sturdy 6ft aluminium step ladder, non-slip feet.", status: "borrowed" }],
  ["pressure-washer", { ownerMemberId: "ananya", name: "Pressure Washer", category: "Garden & Home", condition: "Good", description: "Electric pressure washer for driveways, balconies, and bikes.", status: "borrowed" }],
  ["sewing-machine", { ownerMemberId: "priya", name: "Sewing Machine", category: "Craft", condition: "Excellent", description: "Electric sewing machine with straight and zigzag stitch.", status: "available" }],
  ["lawn-mower", { ownerMemberId: "rahul", name: "Lawn Mower", category: "Garden & Home", condition: "Fair", description: "Electric lawn mower, works well on small lawns.", status: "available" }],
  ["orbital-sander", { ownerMemberId: "ananya", name: "Orbital Sander", category: "Power Tools", condition: "Good", description: "Orbital sander with dust bag and assorted sandpaper.", status: "reserved" }],
  ["hedge-trimmer", { ownerMemberId: "priya", name: "Hedge Trimmer", category: "Garden & Home", condition: "Good", description: "Corded hedge trimmer, 45cm blade.", status: "available" }],
  ["wet-dry-vacuum", { ownerMemberId: "rahul", name: "Wet & Dry Vacuum", category: "Cleaning", condition: "Excellent", description: "Large wet and dry vacuum, good after painting or renovation.", status: "available" }],
  ["tile-cutter", { ownerMemberId: "ananya", name: "Tile Cutter", category: "Power Tools", condition: "Fair", description: "Manual tile cutter for tiles up to 60cm.", status: "available" }],
  ["camping-tent", { ownerMemberId: "priya", name: "Camping Tent 4-Person", category: "Outdoor", condition: "Good", description: "4-person dome tent with ground sheet and pegs.", status: "reserved" }],
];
for (const [id, data] of items) await put("items", id, data);
for (const [id, data] of [
  ["loan-overdue", { itemId: "cordless-drill", borrowerMemberId: "rahul", ownerMemberId: "priya", borrowedAt: "2026-10-10T10:00:00.000Z", dueAt: "2026-10-17T10:00:00.000Z", returnedAt: null, status: "active", item: "cordless-drill", borrower: "rahul" }],
  ["loan-soon", { itemId: "step-ladder", borrowerMemberId: "ananya", ownerMemberId: "rahul", borrowedAt: "2026-10-18T10:00:00.000Z", dueAt: "2026-10-25T10:00:00.000Z", returnedAt: null, status: "active", item: "step-ladder", borrower: "ananya" }],
  ["loan-normal", { itemId: "pressure-washer", borrowerMemberId: "priya", ownerMemberId: "ananya", borrowedAt: "2026-10-23T10:00:00.000Z", dueAt: "2026-10-30T10:00:00.000Z", returnedAt: null, status: "active", item: "pressure-washer", borrower: "priya" }],
]) await put("loans", id, data);
for (const [id, data] of [
  ["res-sander", { itemId: "orbital-sander", memberId: "rahul", reservedAt: "2026-10-23T09:00:00.000Z", status: "active" }],
  ["res-tent", { itemId: "camping-tent", memberId: "ananya", reservedAt: "2026-10-24T09:00:00.000Z", status: "active" }],
]) await put("reservations", id, data);
console.log("Seed done. Create tables/columns/indexes/relationships first - see README.md.");
