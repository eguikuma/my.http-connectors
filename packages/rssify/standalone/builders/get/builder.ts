import { failify, type Outcome } from '@outcomify/requestify'
import type { HttpRestStandaloneConnector } from '@outcomify/restify'

import type { HttpRssStandaloneGet, HttpRssStandaloneGetSource } from '../../models/get'
import type { Feed } from '../../services/parse/models/parsed'
import type { FeedParser } from '../../services/parse/parser'

export const createGet = <Base extends string>(
  http: HttpRestStandaloneConnector<Base>,
  parser: FeedParser,
): HttpRssStandaloneGet<Base> => {
  return async (source: HttpRssStandaloneGetSource<Base>): Promise<Outcome<Feed>> => {
    try {
      const response = await http.get<string>(source)

      if (!response.success) {
        throw response
      }

      const feed = await parser.parse(response.data)

      return {
        success: true,
        status: response.status,
        data: feed,
      }
    } catch (thrown) {
      return failify(thrown)
    }
  }
}
