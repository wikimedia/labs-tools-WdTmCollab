"use client";

import React, { useEffect, useState } from "react";
import Image from "next/image";
import { useParams } from "next/navigation";
import Link from "next/link";
import { endpoints } from "@/utils/endpoints";

interface Award {
  id: string;
  label: string;
  description?: string | null;
  url?: string | null;
}

interface CoActor {
  actorId?: string | null; // maybe a full URL
  name?: string | null;
  description?: string | null;
  image?: string | null;
  sharedWorks?: string | number | null; // from API it's a string
}

interface Production {
  id: string;
  title: string;
  year?: number | null;
}

interface ActorDetail {
  id: string;
  name: string;
  bio?: string | null;
  imageUrl?: string | null;
  dateOfBirth?: string | null;
  placeOfBirth?: string | null;
  countryOfCitizenship?: string | null;
  gender?: string | null;
  occupations?: string[] | null;
  productions: Production[];
  awards?: Award[] | null;
  website?: string | null;
  coActors?: CoActor[] | null;
}

export default function ActorDetailPage() {
  const params = useParams();
  const actorId = (params?.id as string) ?? "";
  const [actor, setActor] = useState<ActorDetail | null>(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (!actorId) return;

    async function fetchActorData() {
      setLoading(true);
      try {
        const resp = await fetch(endpoints.actorDetails(actorId));
        if (!resp.ok) throw new Error(`HTTP ${resp.status}`);
        const raw: any = await resp.json();

        // Normalize array/object response
        const api = Array.isArray(raw) ? raw[0] ?? null : raw;
        if (!api) {
          setActor(null);
          return;
        }

        const mapped: ActorDetail = {
          id: String(api.id ?? actorId ?? ""),
          name: api.label ?? api.name ?? "",
          bio: api.description ?? api.bio ?? null,
          imageUrl: api.imageUrl ?? api.image ?? null,
          dateOfBirth: api.dateOfBirth ?? api.birthDate ?? api.dob ?? null,
          placeOfBirth: api.placeOfBirth ?? api.birthPlace ?? null,
          countryOfCitizenship:
            api.countryOfCitizenship ?? api.citizenship ?? null,
          gender: api.gender ?? null,
          occupations: Array.isArray(api.occupations)
            ? api.occupations
            : api.occupations
            ? String(api.occupations)
                .split(",")
                .map((s: string) => s.trim())
            : api.occupation
            ? [String(api.occupation)]
            : null,
          productions: (api.productions || api.filmography || []).map(
            (p: any) => ({
              id: String(p.id ?? p.movieId ?? p.title ?? ""),
              title: p.title ?? p.label ?? p.name ?? "",
              year:
                p.year !== undefined && p.year !== null
                  ? Number(p.year)
                  : p.releaseYear
                  ? Number(p.releaseYear)
                  : null,
            })
          ),
          awards: (api.awards || []).map((a: any) => ({
            id: String(a.id ?? a.awardId ?? a.url ?? ""),
            label: a.label ?? a.name ?? "",
            description: a.description ?? null,
            url: a.url ?? null,
          })),
          website: api.website ?? api.homepage ?? null,
          coActors: (
            api.coActors ||
            api.coactors ||
            api.collaborators ||
            []
          ).map((c: any) => ({
            actorId: c.actorId ?? c.id ?? null,
            name: c.name ?? null,
            description: c.description ?? null,
            image: c.image ?? c.imageUrl ?? null,
            sharedWorks: c.sharedWorks ?? c.shared_works ?? null,
          })),
        };

        setActor(mapped);
      } catch (err) {
        console.error("Failed to fetch actor details:", err);
        setActor(null);
      } finally {
        setLoading(false);
      }
    }

    fetchActorData();
  }, [actorId]);

  function formatDate(date?: string | null) {
    if (!date) return null;
    try {
      const d = new Date(date);
      if (isNaN(d.getTime())) return date; // return raw if invalid
      return d.toLocaleDateString(undefined, {
        year: "numeric",
        month: "long",
        day: "numeric",
      });
    } catch {
      return date;
    }
  }

  return (
    <main>
      <div className="container mx-auto px-4 py-8">
        <div className="mb-6">
          <Link
            href="/actors"
            className="text-blue-600 hover:underline flex items-center"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-4 w-4 mr-1"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
              aria-hidden
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M15 19l-7-7 7-7"
              />
            </svg>
            Back to Actors
          </Link>
        </div>

        <div className="bg-white rounded-xl shadow-md overflow-hidden">
          <div className="p-8">
            <div className="flex flex-col md:flex-row md:items-center gap-6">
              <div className="w-32 h-32 rounded-full bg-gray-200 flex items-center justify-center overflow-hidden flex-shrink-0">
                {loading ? (
                  <div
                    className="animate-pulse w-full h-full bg-gray-200"
                    aria-hidden
                  />
                ) : actor?.imageUrl ? (
                  <img
                    src={actor.imageUrl}
                    alt={actor.name ?? "actor image"}
                    className="w-full h-full object-cover"
                    width={128}
                    height={128}
                  />
                ) : (
                  <div className="text-gray-500 text-4xl">
                    {actor?.name?.charAt(0) ?? "?"}
                  </div>
                )}
              </div>

              <div className="flex-1">
                <h1 className="text-3xl font-bold mb-1">
                  {actor?.name ?? (loading ? "Loading…" : "Unknown")}
                </h1>
                {actor?.id && (
                  <div className="text-sm text-gray-500 mb-2">
                    id: {actor.id}
                  </div>
                )}

                {actor?.bio && (
                  <p className="text-gray-700 mb-4">{actor.bio}</p>
                )}

                <div className="flex flex-wrap gap-3 items-center text-sm">
                  {actor?.gender && (
                    <span className="px-2 py-1 rounded-md bg-gray-100 text-gray-700">
                      {actor.gender}
                    </span>
                  )}

                  {actor?.dateOfBirth && (
                    <div className="text-gray-600">
                      Born: {formatDate(actor.dateOfBirth)}
                    </div>
                  )}

                  {actor?.placeOfBirth && (
                    <div className="text-gray-600">• {actor.placeOfBirth}</div>
                  )}

                  {actor?.countryOfCitizenship && (
                    <div className="text-gray-600">
                      • {actor.countryOfCitizenship}
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>

          <div className="border-t">
            <div className="p-8 grid grid-cols-1 lg:grid-cols-3 gap-8">
              <section className="lg:col-span-2">
                <h2 className="text-xl font-semibold mb-4">Productions</h2>
                {loading ? (
                  <div className="text-gray-600">Loading productions…</div>
                ) : actor &&
                  actor.productions &&
                  actor.productions.length > 0 ? (
                  <ul className="list-disc pl-5 space-y-2">
                    {actor.productions.map((p) => (
                      <li key={p.id}>
                        <Link
                          href={`/productions/${p.id}`}
                          className="text-blue-600 hover:underline"
                        >
                          {p.title} {p.year ? `(${p.year})` : null}
                        </Link>
                      </li>
                    ))}
                  </ul>
                ) : (
                  <div className="text-gray-600">No productions found.</div>
                )}

                <div className="mt-6">
                  <h3 className="text-lg font-semibold mb-2">Awards</h3>
                  {actor?.awards && actor.awards.length > 0 ? (
                    <ul className="space-y-2">
                      {actor.awards.map((a) => (
                        <li key={a.id} className="text-sm">
                          {a.url ? (
                            <a
                              href={a.url}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="text-blue-600 hover:underline"
                            >
                              {a.label}
                            </a>
                          ) : (
                            <span>{a.label}</span>
                          )}
                          {a.description ? (
                            <div className="text-gray-500 text-sm">
                              {a.description}
                            </div>
                          ) : null}
                        </li>
                      ))}
                    </ul>
                  ) : (
                    <div className="text-gray-600">No awards listed.</div>
                  )}
                </div>
              </section>

              <aside className="space-y-4">
                <div>
                  <h3 className="text-lg font-semibold mb-2">Occupations</h3>
                  {actor?.occupations && actor.occupations.length > 0 ? (
                    <div className="flex flex-wrap gap-2">
                      {actor.occupations.map((oc, i) => (
                        <span
                          key={i}
                          className="text-sm bg-gray-100 px-2 py-1 rounded-full text-gray-700"
                        >
                          {oc}
                        </span>
                      ))}
                    </div>
                  ) : (
                    <div className="text-gray-600">
                      Occupations not available.
                    </div>
                  )}
                </div>

                <div>
                  <h3 className="text-lg font-semibold mb-2">Website</h3>
                  {actor?.website ? (
                    <a
                      href={actor.website}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-blue-600 hover:underline break-all"
                    >
                      {actor.website}
                    </a>
                  ) : (
                    <div className="text-gray-600">No website listed.</div>
                  )}
                </div>

                <div>
                  <h3 className="text-lg font-semibold mb-2">Co-actors</h3>
                  {actor?.coActors && actor.coActors.length > 0 ? (
                    <div className="grid grid-cols-2 gap-3 max-h-94 overflow-auto overscroll-contain pr-2">
                      {actor.coActors.map((c, i) => {
                        // attempt to extract short id (Q...) from actorId url
                        const shortId = c.actorId
                          ? String(c.actorId).split("/").pop()
                          : null;
                        return (
                          <div
                            key={i}
                            className="flex items-center gap-3 p-2 rounded-md hover:bg-gray-50"
                          >
                            <div className="w-10 h-10 rounded-full bg-gray-100 overflow-hidden flex-shrink-0">
                              {c.image ? (
                                <img
                                  src={c.image}
                                  alt={c.name ?? "co-actor"}
                                  className="w-full h-full object-cover"
                                  width={40}
                                  height={40}
                                />
                              ) : (
                                <div className="text-gray-500 text-center">
                                  {(c.name && c.name.charAt(0)) ?? "?"}
                                </div>
                              )}
                            </div>
                            <div className="text-sm">
                              <div className="font-medium">
                                {c.name ?? shortId ?? "Unknown"}
                              </div>
                              {c.sharedWorks ? (
                                <div className="text-gray-500">
                                  Shared: {String(c.sharedWorks)}
                                </div>
                              ) : null}
                            </div>
                          </div>
                        );
                      })}
                    </div>
                  ) : (
                    <div className="text-gray-600">
                      No collaborators listed.
                    </div>
                  )}
                </div>
              </aside>
            </div>
          </div>
        </div>
      </div>
    </main>
  );
}
