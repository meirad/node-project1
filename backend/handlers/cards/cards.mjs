import { app } from "../../app.mjs";
import {adminGuard, businessGuard, getUser, guard } from "../../guard.mjs";
import { Card } from "./cards.model.mjs";

// get all cards
app.get("/cards", async (req, res) => {
    res.send(await Card.find());
});


// get cards by user
app.get("/cards/my-cards", guard, async (req, res) => {
    const user = getUser(req);
    res.send(await Card.find({ user_id: user._id }));
});



// get card by id
app.get("/cards/:id",  async (req, res) => {
    const { id } = req.params;  
    try {
        const card = await Card.findById(id); 
        if (card) {
            res.send(card); 
        } else {
            res.status(404).send({ message: "Card not found" }); 
        }
    } catch (error) {
        res.status(500).send({ message: "An error occurred" }); 
    }
});


// sending a new card
app.post("/cards", businessGuard, async (req, res) => {
    const item = req.body;

    const card = new Card({
        title: item.title,
        subtitle: item.subtitle,
        description: item.description,
        phone: item.phone,
        email: item.email,
        address: {
            state: item.address.state,
            country: item.address.country,
            city: item.address.city,
            street: item.address.street,
            houseNamber: item.address.houseNamber,
            zip: item.address.zip,
        },
        bizNumber: item.bizNumber,
        image: {
            url: item.image.url,
            alt: item.image.alt,
        },
        web: item.web,
        user_id: getUser(req)?._id,
    });

    const newCard = await card.save();

    res.send(newCard);
});


// edit card
app.put("/cards/:id", guard, async (req, res) => {
    const { id } = req.params;
    const item = req.body;

    try {
        const card = await Card.findById(id);

        if (!card) {
            return res.status(404).send({ message: "Card not found" });
        }

        if (!req.user || !req.user._id) {
            console.error('User or user ID is undefined:', req.user);
            return res.status(401).send({ message: "User is not authenticated" });
        }
        

        const updatedCard = await Card.findByIdAndUpdate(id, {
            title: item.title,
            subtitle: item.subtitle,
            description: item.description,
            phone: item.phone,
            email: item.email,
            address: {
                state: item.address.state,
                country: item.address.country,
                city: item.address.city,
                street: item.address.street,
                houseNumber: item.address.houseNumber,
                zip: item.address.zip,
            },
            image: {
                url: item.image.url,
                alt: item.image.alt,
            },
            web: item.web,
        }, { new: true });

        res.send(updatedCard); 
    } catch (err) {
        console.error('Error updating card:', err);
        res.status(500).send({ message: "An error occurred while updating the card" });
    }
});


//like a card
app.patch("/cards/:id", guard, async (req, res) => {
    const { id } = req.params;
    const userId = req.user._id;

    try {
        // Use $addToSet to ensure the user ID is only added if it's not already in the likes array
        const card = await Card.findByIdAndUpdate(id, { $addToSet: { likes: userId } }, { new: true });

        // If card not found, return a 404 error
        if (!card) {
            return res.status(404).send({ message: "Card not found" });
        }

        // Return the updated card with the new likes
        res.send(card);
    } catch (err) {
        console.error('Error liking card:', err.message);
        res.status(500).send({ message: "An error occurred while liking the card", error: err.message });
    }
});


// Delete a card
app.delete("/cards/:id", guard, async (req, res) => {
    const { id } = req.params;
    const userId = req.user._id;

    try {
        const card = await Card.findById    
        (id);
        
        if (!card) {
            return res.status(404).send({ message: "Card not found" });
        }

        if (card.user_id.toString() !== userId.toString()) {
            return res.status(403).send({ message: "User is not authorized to delete this card" });
        }

        await Card.findByIdAndDelete(id);

        res.send({ message: "Card deleted" });
    } catch (err) {
        console.error('Error deleting card:', err.message);
        res.status(500).send({ message: "An error occurred while deleting the card", error: err.message });
    }

});



// Update business number
app.put('/cards/:id/biznumber', adminGuard, async (req, res) => {
    const { id } = req.params;
    const { bizNumber } = req.body;
    const userId = req.user._id;

    if (!bizNumber || typeof bizNumber !== 'string' || bizNumber.trim() === "") {
        return res.status(400).send({ message: "Valid business number is required" });
    }

    try {
        const existingCard = await Card.findOne({ bizNumber });
        if (existingCard && existingCard._id.toString() !== id) {
            return res.status(400).send({ message: "This business number is already taken." });
        }

        const card = await Card.findById(id);
        if (!card) {
            return res.status(404).send({ message: "Card not found" });
        }

        card.bizNumber = bizNumber;
        await card.save();

        res.send(card);
    } catch (err) {
        console.error('Error updating card:', err.message);
        res.status(500).send({ message: "An error occurred while updating the card", error: err.message });
    }
});

app.get('/test', async (req, res) => {
    try {
        const cards = await Card.find().limit(10);
        res.send(cards);
    } catch (err) {
        console.error('Error fetching data:', err.message);
        res.status(500).send({ message: "An error occurred while fetching data", error: err.message });
    }
});