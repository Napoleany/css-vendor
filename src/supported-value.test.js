import expect from 'expect.js'
import {getSupport} from 'caniuse-support'

import propertyPrefixFixture from '../tests/fixtures'
import prefix from './prefix'
import supportedValue from './supported-value'

describe('css-vendor', () => {
  describe('.supportedValue()', () => {
    it('should not prefix a simple value', () => {
      expect(supportedValue('display', 'none')).to.be('none')
    })

    it('should not prefix a complex value', () => {
      const value = 'rgba(255, 255, 255, 1.0)'
      expect(supportedValue('color', value)).to.be(value)
    })

    const {level, needPrefix} = getSupport('flexbox')
    if (level === 'full') {
      it('should prefix if needed for flex value', () => {
        const value = needPrefix ? `${prefix.css}flex` : 'flex'
        expect(supportedValue('display', 'flex')).to.be(value)
      })
    }
    else {
      it.skip('flex is not fully supported in the current browser')
    }

    it('should return false when value is unknown', () => {
      expect(supportedValue('display', 'xxx')).to.be(false)
    })

    it('should return false when property is "content"', () => {
      expect(supportedValue('content', 'bar')).to.be(false)
    })

    it('known transition-property value prefixed', () => {
      expect(supportedValue('transition-property', 'all, transform'))
        .to.be(`all, ${propertyPrefixFixture.transform}`)
    })

    it('known transform value prefixed', () => {
      expect(supportedValue('transform', 'rotate(0.5turn)'))
        .to.be('rotate(0.5turn)')
    })

    it('known transition value as array prefixed', () => {
      expect(supportedValue('transition', ['all 100ms ease', 'transform 200ms linear']))
        .to.eql(`all 100ms ease, ${propertyPrefixFixture.transform} 200ms linear`)
    })

    it('known transition value as array with important keyword prefixed', () => {
      expect(supportedValue('transition', ['all 100ms ease', 'transform 200ms linear', '!important']))
        .to.eql(`all 100ms ease, ${propertyPrefixFixture.transform} 200ms linear !important`)
    })

    it('known transition value as two dimensional array prefixed', () => {
      expect(supportedValue('transition', [['all', '100ms', 'ease'], ['transform', '200ms', 'linear']]))
        .to.eql(`all 100ms ease, ${propertyPrefixFixture.transform} 200ms linear`)
    })

    it('known transition value as two dimensional array with important keyword prefixed', () => {
      const value = [
        ['all', '100ms', 'ease'],
        ['transform', '200ms', 'linear'],
        '!important'
      ]
      expect(supportedValue('transition', value))
        .to.eql(`all 100ms ease, ${propertyPrefixFixture.transform} 200ms linear !important`)
    })
  })
})
