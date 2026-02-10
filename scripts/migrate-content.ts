import { createClient } from 'next-sanity'
import path from 'path'
import fs from 'fs'
import { projectId, dataset, apiVersion } from '../src/sanity/env'

// We need a client with a token, but 'sanity exec' provides one via the context if we use the sanity cli client
// However, standard specific migration scripts often just use the SDK. 
// Let's rely on 'sanity exec' injecting the config? 
// Actually, 'sanity exec' runs the script in an environment where we can instantiate a client easily.

// NOTE: We will rely on the user running this via `npx sanity exec` which handles auth
import { getCliClient } from 'sanity/cli'

const client = getCliClient({ apiVersion: '2024-02-28' })

const PROJECTS_DIR = path.join(process.cwd(), 'projects')

async function uploadImage(filePath: string) {
    const fileStream = fs.createReadStream(filePath)
    const doc = await client.assets.upload('image', fileStream, {
        filename: path.basename(filePath)
    })
    return doc
}

async function main() {
    console.log('Starting migration...')

    if (!fs.existsSync(PROJECTS_DIR)) {
        console.error('Projects directory not found:', PROJECTS_DIR)
        return
    }

    const files = fs.readdirSync(PROJECTS_DIR).filter(f => f.match(/\.(jpg|jpeg|png|webp)$/i))

    console.log(`Found ${files.length} images to process.`)

    for (const file of files) {
        console.log(`Processing ${file}...`)

        // Parse filename for metadata
        // Example: "108 Rendering .jpg" -> Lot 108
        // Example: "108 kinley.pdf" (ignored)
        // "110 rendering .jpg"

        /* 
           Heuristic:
           - Match number -> Lot Number
           - Match text -> Address (if available, or generic)
        */

        // Simple heuristic extraction
        const numbers = file.match(/\d+/)
        const lotNum = numbers ? numbers[0] : '??'
        const cleanName = file.replace(/\.(jpg|jpeg|png)$/i, '').replace(/rendering/i, '').trim()

        // Check if project already exists to avoid dupes?
        // For now, just create.

        try {
            const imageAsset = await uploadImage(path.join(PROJECTS_DIR, file))

            const doc = {
                _type: 'project',
                title: cleanName || `Projeect ${lotNum}`,
                lotNumber: `Lot #${lotNum}`,
                address: `${lotNum} Kinley Loop`, // Inferring from other filenames
                status: 'available',
                bedrooms: 4, // Default placeholders
                bathrooms: 3,
                sqFt: 2500,
                mainImage: {
                    _type: 'image',
                    asset: {
                        _type: 'reference',
                        _ref: imageAsset._id
                    }
                }
            }

            await client.create(doc)
            console.log(`Created project for ${file}`)
        } catch (err) {
            console.error(`Failed to process ${file}:`, err)
        }
    }
    console.log('Migration complete.')
}

main().catch(console.error)
