import type { PageLoad } from "./$types";
import { error } from "@sveltejs/kit";

export const load: PageLoad = async ({ params, fetch }) => {
  const { handle } = params;

  try {
    const response = await fetch(`http://localhost:3000/api/users/${handle}/links`);

    if (!response.ok) {
      if (response.status === 404) {
        throw error(404, "User not found");
      }
      throw error(500, "Failed to fetch data from API");
    }

    const data = await response.json();
    return {
      user: data.user,
      links: data.links,
    };
  } catch (e: any) {
    console.error("Error fetching data:", e);
    if (e.status) throw e;
    throw error(500, "Could not connect to the API. Make sure the backend is running.");
  }
};
