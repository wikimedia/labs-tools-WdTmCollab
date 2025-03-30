import { getSharedActorsFunc, getSharedProductionsFunc, } from "../services/productionService.js";
export async function getSharedProductionsController(req, res) {
    const actor1 = req.query.actor1Id;
    const actor2 = req.query.actor2Id;
    const result = await getSharedProductionsFunc(actor1, actor2);
    res.json(result);
}
export async function getSharedActorsController(req, res) {
    const movie1 = req.query.movie1;
    const movie2 = req.query.movie2;
    const result = await getSharedActorsFunc(movie1, movie2);
    res.json(result);
}
