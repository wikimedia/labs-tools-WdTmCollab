"use client";

import React from "react";
import { useParams } from "next/navigation";
import Link from "next/link";
import { useActorDetails } from "@/src/hooks/api/useActors";
import ActorAnalytics from "@/src/components/actors/ActorAnalytics";

export default function ActorDetailPage() {
  const params = useParams();
  const actorId = (params?.id as string) ?? "";

  const { data: actor, isLoading, error } = useActorDetails(actorId);

  function formatDate(date?: string | null) {
    if (!date) return null;
    try {
      const d = new Date(date);
      if (isNaN(d.getTime())) return date;
      return d.toLocaleDateString(undefined, {
        year: "numeric",
        month: "long",
        day: "numeric",
      });
    } catch {
      return date;
    }
  }

  if (isLoading) {
    return (
      <main className="container mx-auto px-4 py-8">
        <div className="text-center text-gray-500 mt-20">Loading actor details...</div>
      </main>
    );
  }

  if (error || !actor) {
    return (
      <main className="container mx-auto px-4 py-8">
        <div className="text-center text-red-500 mt-20">
          Error loading actor. Please try again later.
        </div>
      </main>
    );
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

        <div className="bg-white overflow-hidden">
          {/* Header Section */}
          <div className="p-8">
            <div className="flex flex-col md:flex-row md:items-center gap-6">
              <div className="w-32 h-32 rounded-full bg-gray-200 flex items-center justify-center overflow-hidden flex-shrink-0">
                {actor.imageUrl ? (
                  <img
                    src={actor.imageUrl}
                    alt={actor.name ?? "actor image"}
                    className="w-full h-full object-cover"
                    width={128}
                    height={128}
                  />
                ) : (
                  <div className="text-gray-500 text-4xl">
                    {actor.name?.charAt(0) ?? "?"}
                  </div>
                )}
              </div>

              <div className="flex-1">
                <h1 className="text-3xl font-bold mb-1">{actor.name}</h1>
                <div className="text-sm text-gray-500 mb-2">{actor.id}</div>

                {actor.bio && (
                  <p className="text-gray-700 mb-4">{actor.bio}</p>
                )}

                <div className="flex flex-wrap gap-3 items-center text-sm">
                  {actor.gender && (
                    <span className="px-2 py-1 rounded-md bg-gray-100 text-gray-700">
                      {actor.gender}
                    </span>
                  )}

                  {actor.dateOfBirth && (
                    <div className="text-gray-600">
                      Born: {formatDate(actor.dateOfBirth)}
                    </div>
                  )}

                  {actor.placeOfBirth && (
                    <div className="text-gray-600">• {actor.placeOfBirth}</div>
                  )}

                  {actor.countryOfCitizenship && (
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
                {actor.productions && actor.productions.length > 0 ? (
                  <ul className="list-disc pl-5 space-y-2">
                    {actor.productions.map((p: any) => (
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
                  {actor.awards && actor.awards.length > 0 ? (
                    <ul className="space-y-2">
                      {actor.awards.map((a: any) => (
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
                  {actor.occupations && actor.occupations.length > 0 ? (
                    <div className="flex flex-wrap gap-2">
                      {actor.occupations.map((oc: string, i: number) => (
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
                  {actor.website ? (
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
                  {actor.coActors && actor.coActors.length > 0 ? (
                    <div className="grid grid-cols-2 gap-3 max-h-94 overflow-auto overscroll-contain pr-2">
                      {actor.coActors.map((c: any, i: number) => {
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

        {/* 2. INSERT ANALYTICS HERE */}
        <div className="mt-12">
          <h2 className="text-2xl font-bold text-gray-800 mb-6">Network & Analytics</h2>
          <ActorAnalytics actorId={actorId} />
        </div>

      </div>
    </main>
  );
}