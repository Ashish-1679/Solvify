import api from "../services/api";
import { Link } from "react-router-dom";

import { useState } from "react";

function CreateProblem() {
    const [title, setTitle] = useState("");
    const [description, setDescription] = useState("");
    const [tags, setTags] = useState("");
    const [bounty, setBounty] = useState("");

     const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            const response = await api.post("/problems", {
                title,
                description,
                tags,
                bounty: Number(bounty)
            });

            console.log(response.data);

        } catch (err) {
            console.log(err.response?.data || err.message);
        }
    };

    return (
        <div>
            <h1>Create Problem</h1>
            <form onSubmit={handleSubmit}>
                <input  type="text" placeholder="Enter Title" value={title}
                    onChange={(e) => setTitle(e.target.value)}
                />
                <textarea  placeholder="Enter Description"  value={description}
                    onChange={(e) => setDescription(e.target.value)}
                />

                <input type="text"  placeholder="Enter Tags"   value={tags}
                    onChange={(e) => setTags(e.target.value)}
                />

                <input    type="number"  placeholder="Enter Bounty"    value={bounty}
                    onChange={(e) => setBounty(e.target.value)}
                />

                <button type="submit">Create Problem</button>
            </form>
        </div>
    );
}

export default CreateProblem;
