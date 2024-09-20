import { app } from "../../app.mjs";
import { guard, adminGuard, businessGuard, getUser } from "../../guard.mjs";
import { User } from "./users.model.mjs";


// get all users
app.get("/users", adminGuard, async (req, res) => {
    res.send(await User.find({ isDeleted: { $ne: true } }));
});



// get user by id
app.get("/users/:id", guard, async (req, res) => {
    const user = await User.findById(req.params.id);

    if (!user) {
        return res.status(403).send({ message: "User not found" });
    }

    if (getUser(req).isAdmin || user._id.toString() === getUser(req)._id.toString()) {
        res.send(user);
    } else {
        res.status(401).send('User is not authorized');
    }
});


// edit user
app.put("/users/:id", guard, async (req, res) => {
    const { firstName, lastName, email, phone } = req.body;
    const user = await User.findById(req.params.id);

    if (!user) {
        return res.status(403).send({ message: "User not found" });
    }

    user.firstName  = firstName;
    user.lastName   = lastName;
    user.email      = email;
    user.phone      = phone;

    try {
        await user.save();
        res.send(user);
    } catch (err) {
        if (err.code === 11000) {
            res.status(400).send({ message: "Email is already in use" });
        } else {
            res.status(500).send({ message: "An error occurred" });
        }
    }
});


// delete user
app.delete("/users/:id", guard, async (req, res) => {
    await User.findByIdAndUpdate(req.params.id, { isDeleted: true });
    res.end();
});


 //Change isBusiness status
 app.patch("/users/:id", async (req, res) => {
    try {
        const user = await User.findById(req.params.id);

        if (!user) {
            return res.status(404).send({ error: 'User not found' });
        }

    const newIsBusinessStatus = !user.isBusiness;
    await User.findByIdAndUpdate(req.params.id, { isBusiness: newIsBusinessStatus });
    
    res.send({ message: `User isBusiness status updated to ${newIsBusinessStatus}` });
    } catch (err) {
        console.error('Error updating user:', err); 
        res.status(500).send({ error: 'An unexpected error occurred' });
    }
});

