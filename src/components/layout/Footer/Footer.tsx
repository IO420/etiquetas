import Style from "./Footer.module.css";

function Footer() {
  const year = new Date();

  return (
    <footer className={Style.footer}>
      <div className={Style.yellowPart}></div>
      <div className={Style.text}>
        <p className={Style['footer-p']}>
          Hecho en México. Todos los derechos reservados {year.getFullYear()}.
        </p>
        <p className={Style['footer-p']}>
          Esta página puede ser reproducida con fines no lucrativos, siempre y cuando no se mutile,
          se cite la fuente completa y su dirección electrónica. De otra forma, requiere permiso
          previo por escrito de la institución.
        </p>
      </div>
      <div className={Style.yellowPartOpuest}></div>
    </footer>
  )
}

export default Footer;
//IO