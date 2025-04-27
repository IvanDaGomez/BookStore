
import Footer from '../../components/footer/footer.jsx'
import Header from '../../components/header/header.jsx'
import SideInfo from '../../components/sideInfo'
import MarkdownFileRenderer from './markdownFileRenderer.jsx'

export default function UsoDeCookies () {
  return (
    <>
      <Header />
      <div className='extraFooterInfoContainer'>
        <MarkdownFileRenderer filePath='/usoDeCookies.md' />
      </div>
      <Footer />
      <SideInfo />
    </>
  )
}
