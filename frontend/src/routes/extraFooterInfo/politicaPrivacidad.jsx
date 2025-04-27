
import Footer from '../../components/footer/footer.jsx'
import Header from '../../components/header/header.jsx'
import SideInfo from '../../components/sideInfo'
import MarkdownFileRenderer from './markdownFileRenderer.jsx'

export default function PoliticaPrivacidad () {
  return (
    <>
      <Header />
      <div className='extraFooterInfoContainer'>
        <MarkdownFileRenderer filePath='/politicaPrivacidad.md' />
      </div>
      <Footer />
      <SideInfo />
    </>
  )
}
