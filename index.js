import express from "express";
import * as z from "zod"; 
 
const user = z.object({ 
    name: z.string(),
    surname: z.string(),
    email: z.string(),
    gender: z.enum(["male", "female", "other"])
});

const app = express();

app.use(express.json());

const users = [];

const usage = { user: { gets: 0, creates: 0, success: 0, fail: 0 } }; //invalids tai kai nepraeima userio creation checku, o valids kai praeina

app.get("/users", (req, res) => {
    usage.user.gets++;
    res.setHeader("Content-Type", "text/html");
    res.send(`
        <html>
            <head>
                <title>Users</title>
                <style>
                    body { font-family: sans-serif; margin: 1em; }
                    table { border-collapse: collapse; width: 40%; }
                    th, td { border: 1px solid #ccc; padding: 2px; }
                    th { background: #eee; }
                    .stats { margin-top: 2em; }
                </style>
            </head>
            <body>
                <h4>Users</h4>
                <table>
                    <tr>
                        <th>Name</th>
                        <th>Surname</th>
                        <th>Email</th>
                        <th>Gender</th>
                        <th>Date Created</th>
                    </tr>
                    ${users.map(u => `
                        <tr>
                            <td>${u.name || ""}</td>
                            <td>${u.surname || ""}</td>
                            <td>${u.email || ""}</td>
                            <td>${u.gender || ""}</td>
                            <td>${u.createdAt || ""}</td>
                        </tr>
                    `).join("")}
                </table>
                <div class="stats">
                    <h4>Stats</h4>
                    GETs: ${usage.user.gets}, Creates: ${usage.user.creates}, Success: ${usage.user.success}, Fail: ${usage.user.fail}
                </div>
            </body>
        </html>
    `);
    res.end();
});

app.post("/users", (req, res) => {
    try {
        user.parse(req.body);
        usage.user.success++;
        req.body.createdAt = new Date().toString();
        users.push(req.body);
        usage.user.creates++;
        res.send({ message: "Created user successfully!" });
    }catch (error) {
        usage.user.fail++;
        return res.status(400).send({ message: "Invalid user data!" });
    }
});

app.listen(3000, () => {
    console.log("The create user api has started on port 3000!");
});