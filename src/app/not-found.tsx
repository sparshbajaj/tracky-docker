'use client'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { Button } from '~/components/ui/button'
import { getLocaleFromPathname, pathWithLocale } from '~/i18n-config'

export default function NotFound() {
	const pathname = usePathname()
	const locale = getLocaleFromPathname(pathname ?? '')
	const dashboardHref = pathWithLocale('/dashboard', locale)
	return (
		<html lang='en'>
			<body>
				<section className='flex min-h-screen w-full flex-col place-content-center place-items-center bg-background text-foreground'>
					<h1 className='mb-4 text-6xl font-bold'>404</h1>
					<h2 className='mb-4 text-2xl font-semibold'>Page Not Found</h2>
					<p className='mb-8 max-w-md text-center text-muted-foreground'>
						Sorry, the page you are looking for doesn&apos;t exist or has been
						moved.
					</p>
					<Button asChild>
						<Link href={dashboardHref}>Back to Dashboard</Link>
					</Button>
				</section>
			</body>
		</html>
	)
}
