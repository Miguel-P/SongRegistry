// import the contract artifact
const SongRegistry = artifacts.require('./SongRegistry.sol')

contract('SongRegistry', function (accounts) {
  // predefine the contract instance
  let SongRegistryInstance

  // before each test, create a new contract instance
  beforeEach(async function () {
    SongRegistryInstance = await SongRegistry.new()
  })

  it("Check that song is correctly added to the registry", async function () {
    await SongRegistryInstance.registerSong("Cool song", "example.com", 1, {from: accounts[0]})
    let song = await SongRegistryInstance.songs(0);
    assert(song.title, "Cool", "Song title added incorrectly")
    assert(song.url, "example.com", "Song URL added incorrectly")
    assert(song.owner, accounts[0], "Song owner is not msg.sender")
  })
  // Check the buying feature
  it ("Check that buyers array managed correctly", async () => { // note that this notation is also valid
    await SongRegistryInstance.registerSong("MySong1", "foobar.com", 1, {from: accounts[0]})
    await SongRegistryInstance.buySong(0, {value: 1, from: accounts[6]})
    let numBuyers = await SongRegistryInstance.numBuyers(0, {from: accounts[0]}) // use the public getter
    assert.equal(2, numBuyers, "Number of buyers for songId = 0 not growing correctly")
  })
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

  it ("Check that song array managed correctly", async function () {
    await SongRegistryInstance.registerSong("MySong1", "foobar.com", 1, {from: accounts[0]})
    await SongRegistryInstance.registerSong("MySong2", "foobar.com", 3, {from: accounts[1]})
    let songsLength = await SongRegistryInstance.numSongsRegistered({from: accounts[0]})

    assert.equal(2, songsLength, "Array of songs not growing correctly")
  })
})