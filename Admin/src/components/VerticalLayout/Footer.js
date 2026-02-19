import React from "react"
import { Link } from "react-router-dom"
import { Container, Row, Col } from "reactstrap"

const Footer = () => {
  return (
    <React.Fragment>
      <style>{`
        .footer {
          background: transparent !important;
          border-top: 1px solid rgba(0, 0, 0, 0.05);
          backdrop-filter: blur(10px);
        }
        
        /* Dark mode support */
        [data-layout-mode="dark"] .footer {
          border-top: 1px solid rgba(255, 255, 255, 0.1);
        }
      `}</style>
      <footer className="footer">
        <Container fluid={true}>
          <Row>
            <Col md={6}>{new Date().getFullYear()} Kementerian Agama Republik Indonesia. All rights reserved.</Col>
            <Col md={6}>
              <div className="text-sm-end d-none d-sm-block">
                Design & Develop by
                <Link to="#" className="ms-1 text-decoration-underline">
                  Kementerian Agama Republik Indonesia
                </Link>
              </div>
            </Col>
          </Row>
        </Container>
      </footer>
    </React.Fragment>
  )
}

export default Footer
