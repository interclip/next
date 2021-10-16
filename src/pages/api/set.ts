import type { NextApiRequest, NextApiResponse } from 'next'
import isURL from 'validator/lib/isURL';
import { APIResponse } from '../../lib/types';
import { db } from '../../lib/prisma';
import { dateAddDays } from '../../lib/dates';
import { getRandomID } from '../../lib/generateID';
import { getSession } from "next-auth/react"

export default async function handler(
    req: NextApiRequest,
    res: NextApiResponse<APIResponse>
) {
    const session = await getSession({ req })

    const { url: clipURL } = req.query;

    if (!clipURL) {
        res.status(400).json({
            status: 'error',
            result: 'No URL provided.'
        });
        return;
    }

    if (typeof clipURL === 'object') {
        res.status(400).json({
            status: 'error',
            result: 'Too many URL query params provided. Please only provide one URL per request.'
        });
        return;
    }

    if (!isURL(clipURL)) {
        res.status(400).json({
            status: 'error',
            result: 'An invalid URL provided.'
        });
    }

    const duplicateClip = await db.clip.findFirst({
        where: {
            url: clipURL
        }
    });

    if (duplicateClip) {
        res.status(200).json({ status: 'success', result: duplicateClip });
    } else {

        const getUserIDFromEmail = async (email: string | null | undefined) => {
            if (!email) {
                return null;
            }
            const user = await db.user.findUnique({
                where: {
                    email
                }
            });
            return user?.id || null;
        }

        const newClip = db.clip.create({
            data: {
                code: getRandomID(5),
                url: clipURL,
                expiresAt: dateAddDays(new Date(), 30),
                createdAt: new Date(),
                // Todo(ft): get the real user email
                ownerID: await getUserIDFromEmail(session?.user?.email)
            }
        });

        try {
            res.status(200).json({ status: 'success', result: await newClip })
        } catch (e) {
            res.status(500).json({
                status: 'error',
                result: 'An error with the database has occured.'
            });
        }
    }

}
