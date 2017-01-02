import {List, Map} from 'immutable';
import {expect} from 'chai';
import {setEntries, next, vote} from '../src/core';

describe('application logic', () => {

  describe('setEntries', () => {

    it('adds the entries to the state', () => {
      const state = Map();
      const entries = ['Trainspotting', '28 Days Later'];
      const nextState = setEntries(state, entries);
      expect(nextState).to.equal(Map({
        entries: List.of('Trainspotting', '28 Days Later')
      }));
    });

  });

  describe('next', () => {

    it('takes the next two entries under vote', () => {
      const state = Map({
        entries: List.of('Trainspotting', '28 Days Later', 'Sunshine')
      });
      const nextState = next(state);
      expect(nextState).to.equal(Map({
        vote: Map({
          pair: List.of('Trainspotting', '28 Days Later')
        }),
        entries: List.of('Sunshine')
      }));
    });

  });

  // Voting
  // When a vote is ongoing, it should be possible for people 
  // to vote on entries. When a new vote is cast for an entry,
  // a "tally" for it should appear in the vote. If there 
  // already is a tally for the entry, it should be 
  // incremented:
  describe('vote', () => {

    it('creates a tally for the voted entry', () => {
      const state = Map({
        vote: Map({
          pair: List.of('Trainspotting', '28 Days Later')
        }),
        entries: List()
      });
      const nextState = vote(state, 'Trainspotting');
      expect(nextState).to.equal(Map({
        vote: Map({
          pair: List.of('Trainspotting', '28 Days Later'),
          tally: Map({
            'Trainspotting': 1
          })
        }),
        entries: List()
      }));
    });

    it('adds to existing tally for the voted entry', () => {
      const state = Map({
        vote: Map({
          pair: List.of('Trainspotting', '28 Days Later'),
          tally: Map({
            'Trainspotting': 3,
            '28 Days Later': 2
          })
        }),
        entries: List()
      });
      const nextState = vote(state, 'Trainspotting');
      expect(nextState).to.equal(Map({
        vote: Map({
          pair: List.of('Trainspotting', '28 Days Later'),
          tally: Map({
            'Trainspotting': 4,
            '28 Days Later': 2
          })
        }),
        entries: List()
      }));
    });
  });

  // Moving to The Next Pair
  // Once the vote for a given pair is over, we should proceed 
  // to the next one. The winning entry from the current vote
  // should be kept, and added back to the end of the entries,
  // so that it will later be paired with something else. The
  // losing entry is thrown away. If there is a tie, both 
  // entries are kept.
  it('puts winner a of current vote back to entries', () => {
    const state = Map({
      vote: Map({
        pair: List.of('Trainspotting', '28 Days Later'),
        tally: Map({
          'Trainspotting': 4,
          '28 Days Later': 2
        })
      }),
      entries: List.of('Sunshine', 'Millions', '127 Hours')
    });
    const nextState = next(state);
    expect(nextState).to.equal(Map({
      vote: Map({
        pair: List.of('Sunshine', 'Millions')
      }),
      entries: List.of('127 Hours', 'Trainspotting')
    }));
  });

  it('puts winner b of current vote back to entries', () => {
    const state = Map({
      vote: Map({
        pair: List.of('Trainspotting', '28 Days Later'),
        tally: Map({
          'Trainspotting': 4,
          '28 Days Later': 8
        })
      }),
      entries: List.of('Sunshine', 'Millions', '127 Hours')
    });
    const nextState = next(state);
    expect(nextState).to.equal(Map({
      vote: Map({
        pair: List.of('Sunshine', 'Millions')
      }),
      entries: List.of('127 Hours', '28 Days Later')
    }));
  });

  it('puts both from tied vote back to entries', () => {
    const state = Map({
      vote: Map({
        pair: List.of('Trainspotting', '28 Days Later'),
        tally: Map({
          'Trainspotting': 3,
          '28 Days Later': 3
        })
      }),
      entries: List.of('Sunshine', 'Millions', '127 Hours')
    });
    const nextState = next(state);
    expect(nextState).to.equal(Map({
      vote: Map({
        pair: List.of('Sunshine', 'Millions')
      }),
      entries: List.of('127 Hours', 'Trainspotting', '28 Days Later')
    }));
  });

  // Ending The Vote
  // At some point there's just going to be one entry left 
  // when a vote ends. At that point we have a winning entry. 
  // What we should do is, instead of trying to form a next 
  // vote, just set the winner in the state explicitly. The 
  // vote is over.
  it('marks winner when just one entry left', () => {
    const state = Map({
      vote: Map({
        pair: List.of('Trainspotting', '28 Days Later'),
        tally: Map({
          'Trainspotting': 4,
          '28 Days Later': 2
        })
      }),
      entries: List()
    });
    const nextState = next(state);
    expect(nextState).to.equal(Map({
      winner: 'Trainspotting'
    }));
  });

});