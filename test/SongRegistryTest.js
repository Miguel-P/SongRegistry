// import the contract artifact
// const truffleAssert = require('truffle-assertions') // truffle-assertions is a special assertion library specifically for truffle. It's very silly, but the default assertion and test framework is a generic js testing framework and assertion lib, meaning that you still need a specialist truffle assertion library. THe worst part about this is that you have to install truffle-assertions in every single truffle project that you make if you want to have these specialist assertions in your test.
const SongRegistry = artifacts.require('./SongRegistry.sol')

// test starts here
contract('SongRegistry', function (accounts) { // The variable accounts is provided to us by truffle test. I.e. when we run truffle test, truffle spins up a blockchain emulator which creates 10 accounts that we are able to access as a global variable in our tests. We can then use these 10 accounts to interact with our contract.
  // predefine the contract instance
  let SongRegistryInstance // what the hell does this do?

  // before each test, create a new contract instance
  beforeEach(async function () {
    SongRegistryInstance = await SongRegistry.new() // the reason why you need the await keyword is that apparently, all functions which javascript uses to interact with the blockchain, or everytime you interact with the blockchain the functions from javascript are asynchronous! So you have to say await, otherwise you'll get a promise instead of the actual result.
  })

  // ftest 1 according to pdf
  it("Check that song is correctly added to the registry", async function () {
    await SongRegistryInstance.registerSong("Cool song", "example.com", 1, {from: accounts[0]})
    let song = await SongRegistryInstance.songs(0);
    assert(song.title, "Cool", "Song title added incorrectly")
    assert(song.url, "example.com", "Song URL added incorrectly")
    assert(song.owner, accounts[0], "Song owner is not msg.sender")
  })
  // test 4 according to pdf
  it ("Check that a song can be purchased correctly", async function () {
    await SongRegistryInstance.registerSong("MySong", "foobar.com", 1, {from: accounts[0]})
    await SongRegistryInstance.buySong(0, {value: 1, from: accounts[5]})

    let isAccount0 = await SongRegistryInstance.isBuyer(0, {from: accounts[0]})
    let isAccount5 = await SongRegistryInstance.isBuyer(0, {from: accounts[5]})
    let isAccount3 = await SongRegistryInstance.isBuyer(0, {from: accounts[3]})
    
    assert.isTrue(isAccount0, "Account that registered song must be a listed buyer")
    assert.isTrue(isAccount5, "buySong(..) failed to add acount[5] as buyer")
    assert.isFalse(isAccount3, "Account falsley added as registered buyer??")
  })
// test 3 according to pdf
  it ("Check that song array managed correctly", async function () {
    await SongRegistryInstance.registerSong("MySong1", "foobar.com", 1, {from: accounts[0]})
    await SongRegistryInstance.registerSong("MySong2", "foobar.com", 3, {from: accounts[1]})
    let songsLength = await SongRegistryInstance.numSongsRegistered({from: accounts[0]})

    assert.equal(2, songsLength, "Array of songs not growing correctly")
  })

  it ("Check that buyers array managed correctly", async () => { // note that this notation is also valid
    await SongRegistryInstance.registerSong("MySong1", "foobar.com", 1, {from: accounts[0]})
    await SongRegistryInstance.buySong(0, {value: 1, from: accounts[6]})
    let numBuyers = await SongRegistryInstance.numBuyers(0, {from: accounts[0]}) // use the public getter
    assert.equal(2, numBuyers, "Number of buyers for songId = 0 not growing correctly")
  })
})