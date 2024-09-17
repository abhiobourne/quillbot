import ChatWrapper from '@/components/chat/ChatWrapper'
import PdfRenderer from '@/components/PdfRenderer'
import { db } from '@/db'
import { getKindeServerSession } from '@kinde-oss/kinde-auth-nextjs/server'
import { redirect, notFound } from 'next/navigation'
import React from 'react'


interface PageProps {
    params: {
        fileid: string
    }
}

const Page = async ({params}: PageProps) => {
    const {fileid} = params

    const {getUser} = getKindeServerSession()
    const user = getUser()

    if(!user || !user.id) redirect(`/auth-callback?origin=dashboard/${fileid}`)

        const file = await db.file.findFirst({
            where: {
                userId: user.id,
            },
        })

        if(!file) notFound()
            console.log(file)

    return(
        <div className='flex-1 justify-between flex flex-col h-[calc(100vh-3.5rem)]'>
            <div className='mx-auto w-full max-w-8xl grow lg:flex xl:px-2'>
                {/* left side */}
                <div className='px-4 py-6 sm:px-6 lg:pl-8 xl:flex-1 xl:pl-6'>
                    <div className='flex-1 xl:flex'>
                        <PdfRenderer url={file.key}/>
                    </div>

                </div>
                {/* right side */}
                <div className='shrink-0 flex-[0.75] border-t border-gray-200 lg:w-96 lg:border-l lg:border-t-0'>
                    <ChatWrapper fileId={fileid}/>
                </div>
            </div>
        </div>
    )
}

export default Page
