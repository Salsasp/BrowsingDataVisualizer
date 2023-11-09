"use client"

import BrowsingGraph from './components/Graph'

export default function Home() {

  const nodes = {"first": {x: 100, y: 100, url: "test.com", visits: 3}, "second": {x: 100, y: 150, url: "test2.com", visits: 5}, "third": {x: 150, y: 150, url: "test3.com", visits: 10}, "fourth": {x: 200, y:200, url: "test4.com", visits: 7}};
  const links = [{source: "first", target: "second"}, {source: "second", target: "third"}, {source: "third", target: "first"}, {source: "fourth", target: "first"}, {source: "fourth", target: "third"}];
  
  return (
    <div>
      <BrowsingGraph nodes={nodes} links={links} />
    </div>
  )
}
