import React, { PureComponent } from 'react'
import { WithRouterProps } from 'next/dist/client/with-router'
import { withRouter, SingletonRouter } from 'next/router'
import { countOccurencies } from '../../lib'
import { PointsCounter } from '../PointsCounter'
import { NavigationItem } from '../NavigationItem'
import { Nav, Section, SubSection } from './style'
import { routes } from './routes'

interface NavigationOwnProps {
  router?: SingletonRouter
}

type NavigationProps = WithRouterProps & NavigationOwnProps

class BaseNavigation extends PureComponent<NavigationProps> {
  isSection = (link: string): boolean => !['/', '/afterwords'].includes(link)

  isActive = (link: string): boolean => this.props.router.pathname === link

  isSectionRoot = (link: string): boolean => countOccurencies(/\//g, link) === 1

  isLastPage = (link: string): boolean => link === routes[routes.length - 1].link

  isCompleted = (navLink: string): boolean => {
    const activeLink = this.props.router.pathname
    const activeSection = this.isSectionRoot(activeLink)
      ? activeLink
      : activeLink.substr(0, activeLink.lastIndexOf('/'))

    const activeRouteIndex = routes.findIndex(({ link }) => link === activeSection)
    const navRouteIndex = routes.findIndex(({ link }) => link === navLink)
    return navRouteIndex < activeRouteIndex || this.isLastPage(activeLink)
  }

  containsActive = (link: string): boolean => {
    return this.props.router.pathname.includes(link) && this.isSection(link) && this.isSectionRoot(link)
  }

  render() {
    return (
      <Nav>
        <PointsCounter />

        <Section>
          <h3>Содержание</h3>
          <ul>
            {routes.map(({ link, name, subnav }) => {
              const containsActive = this.containsActive(link)

              return (
                <li key={link}>
                  <NavigationItem
                    href={link}
                    containsActive={containsActive}
                    active={this.isActive(link)}
                    completed={this.isCompleted(link)}
                  >
                    {name}
                  </NavigationItem>

                  {!!subnav && containsActive && (
                    <SubSection>
                      <ul>
                        {subnav.map(({ link, name }) => (
                          <li key={link}>
                            <NavigationItem href={link} active={this.isActive(link)} depth={2}>
                              {name}
                            </NavigationItem>
                          </li>
                        ))}
                      </ul>
                    </SubSection>
                  )}
                </li>
              )
            })}
          </ul>
        </Section>
      </Nav>
    )
  }
}

export const Navigation = withRouter(BaseNavigation)
