import Footer from '../../components/footer/footer.jsx'
import Header from '../../components/header/header.jsx'
import SideInfo from '../../components/sideInfo'
import MarkdownFileRenderer from './markdownFileRenderer.jsx'

const PrivacyPolicy = () => {
  return (
    <>
      <Header />
      <div className='extraFooterInfoContainer'>
        <MarkdownFileRenderer filePath='/markdowns/avisoPrivacidad.md' />
      </div>
      <SideInfo />
      <Footer />
    </>
  )
}

export default PrivacyPolicy
