pragma solidity >= 0.5.0 <0.6.4;

contract SongRegistry {
// Define the API ------------------------------------------------------------------------------------------------
    // define a song
    struct Song {
        address owner;
        uint256 price;
        string title;
        string url;
    }

    Song[] public songs;

    /// Function which allows a user to register a song in the registry
    /// @param _title       the title of the song
    /// @param _url         web location of song
    /// @param _price       price of song in ether
    function registerSong(string memory _title, string memory _url, uint256 _price) public {
        songs.push(Song(msg.sender, _price, _title, _url));
        buyers[songs.length - 1].push(msg.sender);
    }

    /// Function which allows a user to purchase a song
    /// @param _songID      the ID of the song you want to buy
    function buySong(uint256 _songID) public payable {
        require (msg.value == songs[_songID].price, "soz boi");
        buyers[_songID].push(msg.sender);
        Song storage song = songs[_songID]; // this is just gratuitous
        // pay the original owner of the song (the first "buyer" of the song)
        address(uint160(song.owner)).transfer(msg.value);
        // if the original owner address is payable, then do this:
        // song.owner.transfer(msg.value);
    }

    function isBuyer(uint256 _songId) public view returns (bool) {
        address[] storage songBuyers = buyers[_songId]; // this is an efficient way of doing things because:
        bool isOwner = false;
        for (uint i = 0; i < songBuyers.length; i++) {
            if (songBuyers[i] == msg.sender){
                isOwner = true;
            }
        }
        return isOwner;
    }

    function numSongsRegistered() public view returns (uint256) {
        return (songs.length);
    }

    function numBuyers(uint256 _songId) public view returns (uint256) {
        return buyers[_songId].length;
    }

    /// public mapping allows everyone to see who has bought a particular song
    mapping (uint256 => address[]) public buyers;
}