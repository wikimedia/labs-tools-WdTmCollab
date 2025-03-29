import axios from "axios";

exports.getProductionsByProducer = async (producer: any) => {
  //const sparqlQuery = `
  //  SELECT ?production ?productionLabel WHERE {
  //      ?production wdt:P162 ?producerEntity.
  //      ?producerEntity rdfs:label "${producer}"@en.
  //      SERVICE wikibase:label { bd:serviceParam wikibase:language "en". }
  //  } LIMIT 20`;
  //
  //const url = `https://query.wikidata.org/sparql?query=${encodeURIComponent(sparqlQuery)}&format=json`;
  //const response = await axios.get(url);
  //
  //return response.data.results.bindings.map((entry) => ({
  //  id: entry.production.value.split("/").pop(),
  //  title: entry.productionLabel.value,
  //}));
  return "productions by producter";
};

exports.getCommonProductions = async (producer1: any, producer2: any) => {
  //const sparqlQuery = `
  //  SELECT ?production ?productionLabel WHERE {
  //      ?production wdt:P162 ?p1, ?p2.
  //      ?p1 rdfs:label "${producer1}"@en.
  //      ?p2 rdfs:label "${producer2}"@en.
  //      SERVICE wikibase:label { bd:serviceParam wikibase:language "en". }
  //  } LIMIT 20`;
  //
  //const url = `https://query.wikidata.org/sparql?query=${encodeURIComponent(sparqlQuery)}&format=json`;
  //const response = await axios.get(url);
  //
  //return response.data.results.bindings.map((entry) => ({
  //  id: entry.production.value.split("/").pop(),
  //  title: entry.productionLabel.value,
  //}));
  return "common productions";
};
