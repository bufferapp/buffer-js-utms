const utms = require('./utms')

describe('utms', () => {
  describe('refreshUtms', () => {
    it('returns utms if present in the query', () => {
      const query = {
        'utm_source': 'mock-source',
        'utm_medium': 'mock-medium',
      }

      const result = utms.refreshUtms(query)

      expect(result.values).toEqual(query)
    })

    it('ignores invalid utms in the query', () => {
      const query = {
        'utm_source': 'mock-source',
        'utm_fake': 'fake'
      }

      const result = utms.refreshUtms(query)

      expect(result.values).toEqual({
        'utm_source': 'mock-source',
      })
    })

    it('always returns a result', () => {
      const result = utms.refreshUtms()

      expect(result).toEqual({
        values: {},
        updatedAt: expect.any(Number)
      })
    })

    it('adds a updatedAt property to know when they were set', () => {
      const timeStamp = new Date('2019-11-07T11:01:58.135Z').valueOf()
      jest.spyOn(global.Date, 'now')
        .mockImplementationOnce(() => timeStamp)

      const query = { 'utm_source': 'mock-source' }

      const result = utms.refreshUtms(query)

      expect(result.updatedAt).toEqual(timeStamp)
    })

    it('accepts previously set utms as a default', () => {
      const currentQuery = {}
      const previousUtms = {
        values: {
          'utm_source': 'mock-source',
          'utm_medium': 'mock-medium',
        },
        // just about to expire but still valid
        updatedAt: Date.now() - utms.getTimeToLive() + 1
      }

      const result = utms.refreshUtms(currentQuery, previousUtms)

      expect(result).toEqual(previousUtms)
    })

    it('overrides previously set utms when new ones are passed', () => {
      const currentQuery = {
        'utm_source': 'new-mock-source',
      }
      const previousUtms = {
        values: {
          'utm_source': 'mock-source',
          'utm_medium': 'mock-medium',
        },
        // really fresh, still not used
        updatedAt: Date.now()
      }

      const result = utms.refreshUtms(currentQuery, previousUtms)

      expect(result.values).toEqual(currentQuery)
    })

    it('ignores previous utms if they are expired', () => {
      const currentQuery = {}
      const previousUtms = {
        values: {
          'utm_source': 'mock-source',
          'utm_medium': 'mock-medium',
        },
        updatedAt: Date.now() - utms.getTimeToLive() - 1
      }

      const result = utms.refreshUtms(currentQuery, previousUtms)

      expect(result.values).toEqual({})
    })
  })
})
