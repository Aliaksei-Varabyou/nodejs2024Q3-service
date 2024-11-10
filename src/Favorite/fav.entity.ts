import { Entity, Column, PrimaryColumn, ManyToOne, JoinColumn } from 'typeorm';
import { Artist } from 'src/Artist/artist.entity';
import { Album } from 'src/Album/album.entity';
import { Track } from 'src/Track/track.entity';

@Entity()
export class Favorite {
  @PrimaryColumn()
  userId: string;

  @ManyToOne(() => Artist, { nullable: true })
  @JoinColumn({ name: 'artistId' })
  artist: Artist;

  @Column({ nullable: true })
  artistId: string;

  @ManyToOne(() => Album, { nullable: true })
  @JoinColumn({ name: 'albumId' })
  album: Album;

  @Column({ nullable: true })
  albumId: string;

  @ManyToOne(() => Track, { nullable: true })
  @JoinColumn({ name: 'trackId' })
  track: Track;

  @Column({ nullable: true })
  trackId: string;
}
