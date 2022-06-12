const API_URL = 'http://localhost:8000';

async function httpGetPlanets() {
  // TODO: Once API is ready.
  // Load planets and return as JSON.
  const response = await fetch(`${API_URL}/planets`);//fetch built in the browser
  //await bc the function returns a promise (also the function is async)
  return await response.json(); 
  //json fn returns a promise so we need to add await
}

async function httpGetLaunches() {
  const response = await fetch(`${API_URL}/launches`);
  const fetchedLaunches = await response.json(); 
  return fetchedLaunches.sort((a, b) => {
    return a.flightNumber - b.flightNumber;
  })
}


async function httpSubmitLaunch(launch) {
  // Submit given launch data to launch system.
  try {
    return await fetch(`${API_URL}/launches`, {
      method: "post",
      headers: {
        "Content-Type":"application/json",
      },
      body: JSON.stringify(launch),
    }
    );
  } catch (err) {
    return {
      ok: false,
    };
  }
  
}

async function httpAbortLaunch(id) {
  // Delete launch with given ID.
  try {
    return await fetch(`${API_URL}/launches/${id}`, {
      method: "delete",
    });
  } catch (err) {
    console.log(err);
    return {
      ok: false,
    }
  }
 
}

export {
  httpGetPlanets,
  httpGetLaunches,
  httpSubmitLaunch,
  httpAbortLaunch,
};