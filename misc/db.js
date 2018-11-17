/* eslint-disable no-unused-vars, no-use-before-define */
// @flow
/**
 * Database structure as represented by flow-types
 */

type Role = 'OWNER' | 'COLLABORATOR';

type Session = {|
  id: string,
  date_created: number,
  number: number,
  name: string,
  active: boolean,
  allow_anonymous: boolean, // Allow question from anonymous users
  owner: User,
  collaborators: Array<User>,
  questions: Array<Question>, // Pushed in on Question creation, therefore sorted by createion date
|};

// Questions is a subcollection of Sessions
type Question = {|
  id: string,
  date_created: number,
  user: ?(User | string), // User if signed in, string if name provided, null otherwise (if allow_unsigned is true)
  body: string,
  votes: number,
  answered: boolean, // Is answered
  in_queue: boolean, // In queue for being answered
  removed: boolean,
  session: Session,
|};

type User = {|
  id: string,
  date_created: number,
  name_first: string,
  name_last: string,
  sessions: Array<Session>,
  questions: Array<Question>,
|};
