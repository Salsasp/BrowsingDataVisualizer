import './globals.css'
import NavBar from './components/NavBar'


export const metadata = {
  title: 'Browse Viz',
  description: 'Browsing data visualizer',
}

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body className="bg-white h-screen">
	<NavBar />
	{children}
      </body>
    </html>
  )
}
