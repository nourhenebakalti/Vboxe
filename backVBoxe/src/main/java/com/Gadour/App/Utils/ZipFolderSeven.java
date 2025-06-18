package com.Gadour.App.Utils;
import java.io.FileOutputStream;
import java.io.IOException;
import java.nio.file.FileVisitResult;
import java.nio.file.Files;
import java.nio.file.Path;
import java.nio.file.Paths;
import java.nio.file.SimpleFileVisitor;
import java.nio.file.attribute.BasicFileAttributes;
import java.util.zip.ZipEntry;
import java.util.zip.ZipOutputStream;

public class ZipFolderSeven {
  // Source folder which has to be zipped
  static final String FOLDER = System.getProperty("user.home") + "/Desktop/temp2";
  public void main() {
    ZipFolderSeven zs = new ZipFolderSeven();
    zs.zippingInSeven();
  }
  public void zippingInSeven(){
    // try with resources - creating outputstream and ZipOutputSttream
    try (FileOutputStream fos = new FileOutputStream(FOLDER.concat(".zip"));
        ZipOutputStream zos = new ZipOutputStream(fos)) {            
      Path sourcePath = Paths.get(FOLDER);
      // using WalkFileTree to traverse directory
      Files.walkFileTree(sourcePath, new SimpleFileVisitor<Path>(){
        @Override
        public FileVisitResult preVisitDirectory(final Path dir, final BasicFileAttributes attrs) throws IOException {
          // it starts with the source folder so skipping that 
          if(!sourcePath.equals(dir)){
            //System.out.println("DIR   " + dir);
            zos.putNextEntry(new ZipEntry(sourcePath.relativize(dir).toString() + "/"));            
            zos.closeEntry();    
          }
          return FileVisitResult.CONTINUE;
        }
        @Override
        public FileVisitResult visitFile(final Path file, final BasicFileAttributes attrs) throws IOException {
          zos.putNextEntry(new ZipEntry(sourcePath.relativize(file).toString()));
          Files.copy(file, zos);
          zos.closeEntry();
          return FileVisitResult.CONTINUE;
        }
      });
    } catch (IOException e) {
      // TODO Auto-generated catch block
      e.printStackTrace();
    }
  }
}