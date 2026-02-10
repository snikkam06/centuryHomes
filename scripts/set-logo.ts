import { getCliClient } from 'sanity/cli'
import path from 'path'
import fs from 'fs'

const client = getCliClient({ apiVersion: '2024-02-28' })

const LOGO_PATH = path.join(process.cwd(), 'Century Homes Logo sourcefile', 'CENTURY HOMES 3.png')

async function main() {
    console.log('Setting up logo...')

    if (!fs.existsSync(LOGO_PATH)) {
        console.error('Logo not found at:', LOGO_PATH)
        return
    }

    try {
        const fileStream = fs.createReadStream(LOGO_PATH)
        const imageAsset = await client.assets.upload('image', fileStream, {
            filename: 'century-homes-logo.png'
        })

        // Create or update the settings document
        await client.createOrReplace({
            _id: 'settings', // Singleton ID
            _type: 'settings',
            companyName: 'Century Homes',
            contactEmail: 'hello@centuryhomes.com', // Default placeholder
            phoneNumber: '(555) 012-3456',
            logo: {
                _type: 'image',
                asset: {
                    _type: 'reference',
                    _ref: imageAsset._id
                }
            }
        })

        console.log('Logo updated successfully.')
    } catch (err) {
        console.error('Failed to set logo:', err)
    }
}

main().catch(console.error)
