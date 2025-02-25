"use client";

import React, { useState } from "react";

const api_key = process.env.REACT_APP_GOOGLE_MAPS_API_KEY;

export default function SubmitRequests() {
    const [street, setStreet] = useState("");
    const [city, setCity] = useState("");
    const [country, setCountry] = useState("");
    const [loading, setLoading] = useState(false);
    const [image, setImage] = useState<string | null>(null);  // Set initial state to null with type string | null
    const [metadata, setMetadata] = useState(null);  // Store metadata response (optional, for debugging)

    const fetchImage = async () => {
        if (street === "" || city === "" || country === "") {
            return;
        }
    
        console.log("API call attempted.");

        // Create the location string
        const location = `${street}, ${city}, ${country}`;
    
        // URL-encode the location string to ensure it's safe for the URL
        const encodedLocation = encodeURIComponent(location);
    
        // Construct the metadata API URL
        const metadata_URL = `https://maps.googleapis.com/maps/api/streetview/metadata?key=${api_key}&location=${encodedLocation}`;
    
        setLoading(true); // Set loading state to true before making the request
    
        // Fetch the metadata to check if the location is valid
        try {
            const response = await fetch(metadata_URL);
            const data = await response.json();
            setMetadata(data);  // Optional: Set metadata for debugging

            if (data.status !== "OK") {
                // Handle case where the location data cannot be obtained
                setLoading(false);
                console.error("Location data cannot be obtained:", data);
                return;
            }

            // Proceed with the StreetView API request if metadata is valid
            const streetView_URL = `https://maps.googleapis.com/maps/api/streetview?key=${api_key}&size=600x400&location=${encodedLocation}`;
            
            // Set the StreetView image URL to state
            setImage(streetView_URL);
            
            setLoading(false);  // Set loading state to false after processing
        } catch (error) {
            // Handle errors (e.g., network issues)
            setLoading(false);
            console.error("Error fetching Google Maps metadata:", error);
        }
    };

    return (
        <div className="container">
            <h1>REQUESTS</h1>
            <form className="inputs">
                <input
                    type="text"
                    name="street"
                    id="street"
                    className="form-control w-50 me-3 mt-3"
                    placeholder="Street Address"
                    onChange={(e) => setStreet(e.target.value)}
                />
                <input
                    type="text"
                    name="city"
                    id="city"
                    className="form-control w-50 me-3 mt-3 "
                    placeholder="City"
                    onChange={(e) => setCity(e.target.value)}
                />
                <input
                    type="text"
                    name="country"
                    id="country"
                    className="form-control w-50 me-3 mt-3"
                    placeholder="Country"
                    onChange={(e) => setCountry(e.target.value)}
                />

                <button
                    type="button"
                    className="btn btn-primary border d-flex mt-3"
                    onClick={fetchImage}  // Use fetchImage to make the API call
                >
                    Submit
                </button>
            </form>

            <hr />
            <div className="input-display">
                <h4>
                    <b>Input:</b>
                </h4>
                <h5>{`Street: ${street}`}</h5>
                <h5>{`City: ${city}`}</h5>
                <h5>{`Country: ${country}`}</h5>
            </div>

            <div className="output-display">
                {loading ? (
                    <h3>Loading...</h3>
                ) : (
                    <div>
                        <h3>{`This is what ${street}, ${city}, ${country} looks like`}</h3>
                        {image ? <img src={image} alt={`Street view of ${street}, ${city}, ${country}`} /> : <h5>Image not found.</h5>}
                        <h3>This is the metadata returned from the request: </h3>
                        <h5>{JSON.stringify(metadata)}</h5>
                    </div>
                )}
            </div>
        </div>
    );
}
