import markdown from 'markdown-in-js'


export const Glossary = () => markdown`

<div className="glossary-header" id="b">Blockchain bottleneck</div>
<p>
As more transactions are issued, the block rate and size become a bottleneck in the system. It can no longer include all incoming transactions promptly. Attempts to speed up block rates will introduce more orphan blocks (blocks being left behind) and reduce the security of the blockchain.
</p>

<div className="glossary-header" id="c">Consensus</div>
<p>
Agreement on a specific datum or value in distributed multi-agent systems, in the presence of faulty processes.
</p>

<div className="glossary-header">Coordinator</div>
<p>
A trusted entity that issues milestones to guarantee finality and protect the Tangle against attacks.
</p>

<div className="glossary-header">Cumulative weight</div>
<p>
A transaction rating system. Each additional transaction that references a transaction increases its cumulative weight. Tip selection favors a path through transactions that has a higher cumulative weight.
</p>

<div className="glossary-header" id="e">Eclipse attack</div>
<p>
A cyber-attack that aims to isolate and attack a specific user, rather than the whole network.
</p>

<div className="glossary-header" id="f">Finality</div>
<p>
The property that once a transaction is completed there is no way to revert or alter it. This is the moment when the parties involved in a transfer can consider the deal done. Finality can be deterministic or probabilistic.
</p>

<div className="glossary-header" id="h">History</div>
<p>
The list of transactions directly or indirectly approved by a given transaction.
</p>

<div className="glossary-header" id="i">IXI</div>
<p>
IOTA eXtending Interface, a framework to extend the functionality of an IOTA node by reacting to incoming transactions and/or providing additional API calls.
</p>

<div className="glossary-header" id="l">Local modifiers</div>
<p>
Custom conditions that nodes can take into account during tip selection. In IOTA, nodes do not necessarily have the same view of the Tangle; various kinds of information only locally available to them can be used to strengthen security. Read more about local modifiers <a href="https://assets.ctfassets.net/r1dr6vzfxhev/4p2Jh4jQzYwmQSqScgKW2G/6bd776742d48e6a44fca66845e956e8e/Local_Modifiers_in_the_Tangle.pdf">here</a>.
</p>

<div className="glossary-header" id="m">Mana</div>
<p>
The reputation of a node is based on a virtual token called mana. This reputation, working as a Sybil protection mechanism, is important for issuing more transactions (see Module 3) and having a higher influence during the voting process (see Module 5).
</p>

<div className="glossary-header">Message overhead</div>
<p>
The additional information (metadata) that needs to be sent along with the actual information (data). This can contain signatures, voting, heartbeat signals, and anything that is transmitted over the network but is not the transaction itself.
</p>

<div className="glossary-header">Milestones</div>
<p>
Milestones are transactions signed and issued by the Coordinator. Their main goal is to help the Tangle to grow healthily and to guarantee finality. When milestones directly or indirectly approve a transaction in the Tangle, nodes mark the state of that transaction and its entire history as confirmed. 
</p>

<div className="glossary-header">Mining races</div>
<p>
In PoW-based DLTs, competition between nodes to obtain mining rewards and transaction fees are known as mining races. These are undesirable as they favor more powerful nodes, especially those with highly optimized hardware like ASICs. As such, they block participation by regular or IoT hardware and are harmful for the environment.
</p>

<div className="glossary-header" id="n">Nakamoto consensus</div>
<p>
Named after the originator of Bitcoin, Satoshi Nakamoto, Nakamoto consensus describes the replacement of voting/communication between known agents with a cryptographic puzzle (Proof-of-Work). Completing the puzzle determines which agent is the next to act.
</p>

<div className="glossary-header">Neighbors</div>
<p>
Network nodes that are directly connected and can exchange messages without intermediate nodes.
</p>

<div className="glossary-header">Node</div>
<p>
A machine which is part of the IOTA network. Its role is to issue new transactions and to validate existing ones.
</p>

<div className="glossary-header" id="o">Orphan</div>
<p>
A transaction (or block) that is not referenced by any succeeding transaction (or block). An orphan is not considered confirmed and will not be part of the consensus.
</p>

<div className="glossary-header" id="p">Parasite-chain attacks</div>
<p>
A double spend attack on the Tangle. Here an attacker attempts to undo a transaction by building an alternative Tangle in which the funds were not spent. They then try to get the majority of the network to accept the alternative Tangle as the legitimate one.
</p>

<div className="glossary-header">Peering</div>
<p>
The procedure of discovering and connecting to other network nodes.
</p>

<div className="glossary-header">Promotion and reattachment</div>
<p>
Strategies used in IOTA to reintroduce orphaned transactions. 
</p>

<div className="glossary-header">Promotion</div>
<p>
Attaching empty transactions that reference both the original transaction and newer parts of the Tangle in an attempt to get “picked up” by random walks.
</p>

<div className="glossary-header">Proof-of-Work</div>
<p>
Data which is difficult (costly, time-consuming) to produce but easy for others to verify.
</p>

<div className="glossary-header" id="r">Random walk</div>
<p>
A mathematical object that describes a path, which consists of a succession of random steps in some mathematical space.
</p>

<div className="glossary-header">Reattachment</div>
<p>
Resending a transaction by redoing tip selection and referencing newer tips by redoing PoW.
</p>

<div className="glossary-header" id="s">Small-world network</div>
<p>
A network in which most nodes can be reached from every other node by a small number of intermediate steps. 
</p>

<div className="glossary-header">Solidification time</div>
<p>
The solidification time is the point at which the entire history of a transaction has been received by a node.
</p>

<div className="glossary-header">Splitting attacks</div>
<p>
An attack in which a malicious node attempts to split the Tangle into two branches. As one of the branches grows the attacker publishes transactions on the other branch to keep both alive.Splitting attacks attempt to slow down the consensus process or conduct a double spend.
</p>

<div className="glossary-header">Subtangle</div>
<p>
A consistent section of the Tangle (i.e. a subset of transactions), such that each included transaction also includes its referenced transactions. 
</p>

<div className="glossary-header">Sybil attack</div>
<p>
An attempt to gain control over a peer-to-peer network by forging multiple fake identities.
</p>

<div className="glossary-header" id="t">Tip</div>
<p>
A transaction that has not yet been approved.
</p>

<div className="glossary-header">Tip selection</div>
<p>
The process of selecting previous transactions to be referenced by a new transaction. These references are where a transaction attaches to the existing data structure. IOTA only enforces that a transaction approves two other transactions, but the tip selection strategy is left up to the user (with a good default provided by IOTA).
</p>

<div className="glossary-header">Transaction</div>
<p>
A message that transfers funds or information between two nodes. A transaction is referred to as “solid” if its entire history is known.
</p>

`
