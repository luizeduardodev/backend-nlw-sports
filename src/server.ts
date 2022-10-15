import express from "express"; //Biblioteca Node.js para criar servidores;
import { PrismaClient } from "@prisma/client"; //orm para criação de banco de dados;
import cors from "cors"; //Permite fazer a ligacação do front com o back;

import convertHoursStringToMinutes from "./utils/convert-hour-string-to-minutes";
import convertMinutesToHourString from "./utils/convert-minutes-to-hour-string";

const app = express();
const port = 3000;

app.use(express.json());
app.use(cors());

const prisma = new PrismaClient({
    log: ["query"]
});

app.get("/games", async (req, res) => {
    const games = await prisma.game.findMany({
        include: {
            _count: {
                select: {
                    ads: true
                }
            }
        }
    });

    return res.json(games);
});

app.post("/games/:id/ads", async (req, res) => {
    const gameId = req.params.id;
    const body = req.body;

    const ad = await prisma.ad.create({
        data: {
            gameId,
            name: body.name,
            yearsPlaying: body.yearsPlaying,
            discord: body.discord,
            weekDays: body.weekDays.join(","),
            hoursStart: convertHoursStringToMinutes(body.hoursStart),
            hourEnd: convertHoursStringToMinutes(body.hourEnd),
            useVoiceChannel: body.useVoiceChannel
        }
    });

    return res.status(201).json(ad);
});

app.get("/games/:id/ads", async (req, res) => {
    const gameId = req.params.id;

    const ads = await prisma.ad.findMany({
        select: {
            id: true,
            name: true,
            weekDays: true,
            useVoiceChannel: true,
            yearsPlaying: true,
            hoursStart: true,
            hourEnd: true
        },
        where: {
            gameId
        },
        orderBy: {
            createdAt: "desc"
        }
    });

    return res.send(
        ads.map((ad) => {
            return {
                ...ad,
                weekDays: ad.weekDays.split(","),
                hoursStart: convertMinutesToHourString(ad.hoursStart),
                hourEnd: convertMinutesToHourString(ad.hourEnd)
            };
        })
    );
});

app.get("/ads/:id/discord", async (req, res) => {
    const adId = req.params.id;

    const ad = await prisma.ad.findUniqueOrThrow({
        select: {
            discord: true
        },
        where: {
            id: adId
        }
    });

    return res.json({
        discord: ad.discord
    });
});

app.listen(port, () => {
    console.log("Servidor iniciado!");
});
