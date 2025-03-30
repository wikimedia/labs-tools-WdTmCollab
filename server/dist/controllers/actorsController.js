import { findAllActors, findCoActors, searchWikidataActor, } from "../services/actorsService.js";
export async function getAllActors(req, res) {
    try {
        const result = await findAllActors();
        res.json(result);
    }
    catch (error) {
        console.error("Error in AllActors controller:", error);
        res.status(500).json({ error: "Internal server error" });
    }
}
export function getFrequentCollaborators(req, res) {
    res.send("getting frequent collaborators");
}
export function getCoActors(req, res) {
    const result = findCoActors(req.query.actorId);
    res.json(result);
}
//export function actorSearch(req: Request, res: Response) {
//  return searchWikidataActor(req.params.name);
//}
//
export async function actorSearch(req, res) {
    try {
        const name = req.query.name;
        if (!name) {
            return res.status(400).json({ error: "Missing 'name' query parameter" });
        }
        const results = await searchWikidataActor(name);
        //const results: any = [];z
        res.json(results); // ✅ Send results to client
    }
    catch (error) {
        console.error("Error searching actor:", error);
        return res.status(500).json({ error: "Internal server error" });
    }
}
