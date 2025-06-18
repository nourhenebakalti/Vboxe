package com.Gadour.App.Utils;

import java.io.File;

public class deleteFilesDir {
	public static final String DIRECTORY = System.getProperty("user.home") + "/Desktop/temp2";
	
	
	public void deleteFiles(String dirName)
    {
        File fileDir = new File(dirName);
        File[] listOfFiles = fileDir.listFiles();
        for (File file : listOfFiles)
        {
            boolean isDeleted = file.delete();
            System.out.println(file.getAbsolutePath() + " isDeleted = "
                                                            + isDeleted);
        }

    }
}
